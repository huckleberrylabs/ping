import React, { useState } from "react";
import moment, { Moment } from "moment";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router";
import { useObservable } from "../../observable";
import { analyticsService } from "../../services";
import { Routes } from "../../config";
import { UUID, Errors, Widget } from "@huckleberrylabs/ping-core";

// UI
import { ErrorButton } from "../../components/error-button";
import { Loading } from "../../components/loading";
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from "recharts";
import "react-dates/initialize";
import { DateRangePicker, isInclusivelyBeforeDay } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";
import "./style.css";

type Data = {
  date: string;
  "57db7116-a386-418a-8e24-e6668f911940": number;
  "845eadfb-c8d3-499c-8ec4-b7e1b182b3d4": number;
  "179b3014-4b93-40e6-beb9-5153ddf8e3af": number;
  [key: string]: any;
};

type EventName = "Page Load" | "Widget Click" | "Ping Sent";
const EventNames: EventName[] = ["Page Load", "Widget Click", "Ping Sent"];
const EventNamesMap = {
  "Page Load": "57db7116-a386-418a-8e24-e6668f911940",
  "Widget Click": "845eadfb-c8d3-499c-8ec4-b7e1b182b3d4",
  "Ping Sent": "179b3014-4b93-40e6-beb9-5153ddf8e3af",
};

type TimeScale = "Days" | "Weeks" | "Months";
const TimeScales: TimeScale[] = ["Days", "Weeks", "Months"];

const dataFromEvents = (events: Widget.Analytics.Model.T[]): Data[] => {
  const agg: { [key: string]: Data } = {};
  events.forEach((event) => {
    const date = moment(event.timestamp).format("YYYY-MM-DD");
    if (agg[date]) {
      agg[date][event.action] += 1;
    } else {
      agg[date] = {
        date,
        "57db7116-a386-418a-8e24-e6668f911940": 0,
        "845eadfb-c8d3-499c-8ec4-b7e1b182b3d4": 0,
        "179b3014-4b93-40e6-beb9-5153ddf8e3af": 0,
      };
    }
  });
  return Object.values(agg).sort((a, b) =>
    moment(a.date, "YYYY-MM-DD").diff(moment(b.date, "YYYY-MM-DD"))
  );
};

const sliceByDateRange = (
  data: Data[],
  begin: Moment | null,
  end: Moment | null
) =>
  data.filter((datum) => {
    if (begin !== null && end !== null)
      return moment(datum.date).isBetween(begin, end, "day", "[]");
    if (begin !== null) return moment(datum.date).isAfter(begin);
    if (end !== null) return moment(datum.date).isBefore(end);
    return true;
  });

const aggregateByTimeScale = (data: Data[], scale: TimeScale) => {
  if (scale === "Days") return data;
  else if (scale === "Weeks") {
    const result: Data[] = [];
    let agg: Data = data[0];
    for (let i = 1; i < data.length; i++) {
      const datum = data[i];
      if (i % 7 === 0) {
        result.push(agg);
        agg = datum;
      } else {
        agg.visits += datum.visits;
        agg.clicks += datum.clicks;
        agg.sends += datum.sends;
      }
    }
    return result;
  } else {
    const result: Data[] = [];
    let agg: Data = data[0];
    for (let i = 1; i < data.length; i++) {
      const datum = data[i];
      if (
        moment(agg.date, "YYYY-MM-DD").month() ===
        moment(datum.date, "YYYY-MM-DD").month()
      ) {
        agg.visits += datum.visits;
        agg.clicks += datum.clicks;
        agg.sends += datum.sends;
      } else {
        result.push(agg);
        agg = datum;
      }
    }
    return result;
  }
};

const InterpolateData = (data: Data[], timeScale: TimeScale) => {
  return data;
  /*   if (timeScale === "Days") {
    const first = data[0];
    const last = data[0];
    return data;
  } else if (timeScale === "Weeks") {
  } else {
  } */
};

export const Analytics = () => {
  const { id } = useParams();
  const history = useHistory();

  const state = useObservable(analyticsService.state);
  const map = useObservable(analyticsService.map);
  const [eventName, setEventName] = useState<EventName>("Page Load");
  const [timeScale, setTimeScale] = useState<TimeScale>("Days");
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [focusedInput, setFocusedInput] = useState<
    "startDate" | "endDate" | null
  >(null);

  const [windowWidth, setWidth] = useState<number>(window.innerWidth);
  window.onresize = () => {
    if (window.innerWidth - 350 > 770) setWidth(window.innerWidth);
  };

  if (!UUID.Is(id)) history.push(Routes.widgets);
  if (Errors.Is(state)) {
    if (Errors.NotFound.Is(state)) {
      return <div>No Analytics Events Yet</div>;
    } else {
      // @ts-ignore
      toast.error(state.userMessage);
      return <ErrorButton />;
    }
  }
  const events = map.get(id);
  if (events) {
    const data = InterpolateData(
      aggregateByTimeScale(
        sliceByDateRange(dataFromEvents(events), startDate, endDate),
        timeScale
      ),
      timeScale
    );
    console.log(events);
    console.log(dataFromEvents(events));
    return (
      <>
        <h1>Widget Analytics</h1>
        <div className="analytics-controls">
          <DateRangePicker
            startDate={startDate}
            startDateId="your_unique_start_date_id"
            endDate={endDate}
            endDateId="your_unique_end_date_id"
            onDatesChange={({ startDate, endDate }) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
            focusedInput={focusedInput}
            onFocusChange={setFocusedInput}
            isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
          />
          <Select
            label="Event Type"
            enhanced
            outlined
            options={EventNames}
            value={eventName}
            onChange={(event) => {
              const value = (event.target as HTMLInputElement)
                .value as EventName;
              setEventName(value);
            }}
          />
          <Select
            label="Time Scale"
            enhanced
            outlined
            options={TimeScales}
            value={timeScale}
            onChange={(event) => {
              const value = (event.target as HTMLInputElement)
                .value as TimeScale;
              setTimeScale(value);
            }}
          />
        </div>
        <LineChart
          width={Math.max(windowWidth - 350, 770)}
          height={500}
          data={data}
        >
          <XAxis
            dataKey="date"
            tickFormatter={(tickItem) => {
              if (timeScale === "Days") {
                return moment(tickItem).format("MMM Do");
              } else if (timeScale === "Weeks") {
                return moment(tickItem).format("YYYY-W");
              } else {
                return moment(tickItem).format("YYYY-MM");
              }
            }}
          />
          <YAxis domain={[0, "auto"]} />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey={EventNamesMap[eventName]}
            stroke="#8884d8"
          />
        </LineChart>
      </>
    );
  } else {
    analyticsService.get(id);
  }
  // AnalyticsStates.LOADING
  return <Loading />;
};

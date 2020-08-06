import React, { useState } from "react";
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from "recharts";
import moment, { Moment } from "moment";

// Date Picker
import "react-dates/initialize";
import { DateRangePicker, isInclusivelyBeforeDay } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

// Select Field
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";

// Style
import "./style.css";

const getDaysArray = () => {
  const now = new Date();
  const year = now.getFullYear();
  const date = new Date(year, 0, 1);
  const result = [];
  while (date.getFullYear() === year) {
    result.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return result;
};

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

type Data = {
  date: Date;
  visits: number;
  clicks: number;
  sends: number;
  xaxis: string;
};

const dataGen = () =>
  getDaysArray().map((date) => ({
    date,
    visits: getRandomInt(80, 100),
    clicks: getRandomInt(0, 20),
    sends: getRandomInt(0, 10),
    xaxis: `${date.getMonth() + 1}-${date.getDate()}`,
  }));

const generatedData = dataGen();

const sliceByDateRange = (
  data: Data[],
  begin: Moment | null,
  end: Moment | null
) =>
  data.filter((datum) => {
    if (begin !== null && end !== null)
      return moment(datum.date).isBetween(begin, end);
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
      if (agg.date.getMonth() === datum.date.getMonth()) {
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

type EventName = "Site Visits" | "Widget Clicks" | "Message Sends";
const EventNames: EventName[] = [
  "Site Visits",
  "Widget Clicks",
  "Message Sends",
];
const EventNamesMap = {
  "Site Visits": "visits",
  "Widget Clicks": "clicks",
  "Message Sends": "sends",
};

type TimeScale = "Days" | "Weeks" | "Months";
const TimeScales: TimeScale[] = ["Days", "Weeks", "Months"];

export const Analytics = () => {
  const [windowWidth, setWidth] = useState<number>(window.innerWidth);
  const [eventName, setEventName] = useState<EventName>("Site Visits");
  const [timeScale, setTimeScale] = useState<TimeScale>("Months");
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [focusedInput, setFocusedInput] = useState<
    "startDate" | "endDate" | null
  >(null);

  window.onresize = () => {
    if (window.innerWidth - 350 > 770) setWidth(window.innerWidth);
  };
  const data = aggregateByTimeScale(
    sliceByDateRange(generatedData, startDate, endDate),
    timeScale
  );
  return (
    <>
      <h1>Widget Analytics</h1>
      <div className="analytics-controls">
        <DateRangePicker
          startDate={startDate} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={({ startDate, endDate }) => {
            console.log(startDate, endDate);
            setStartDate(startDate);
            setEndDate(endDate);
          }} // PropTypes.func.isRequired,
          focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={setFocusedInput} // PropTypes.func.isRequired,
          isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
        />
        <Select
          label="Event Type"
          enhanced
          outlined
          options={EventNames}
          value={eventName}
          onChange={(event) => {
            const value = (event.target as HTMLInputElement).value as EventName;
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
            const value = (event.target as HTMLInputElement).value as TimeScale;
            setTimeScale(value);
          }}
        />
      </div>
      <LineChart
        width={Math.max(windowWidth - 350, 770)}
        height={500}
        data={data}
      >
        <XAxis dataKey="xaxis" />
        <YAxis domain={["auto", "auto"]} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line
          type="monotone"
          dataKey={EventNamesMap[eventName]}
          stroke="#8884d8"
        />
      </LineChart>
    </>
  );
};

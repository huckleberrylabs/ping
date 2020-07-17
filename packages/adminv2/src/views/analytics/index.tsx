import React, { useState } from "react";
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from "recharts";
// import moment from "moment";

// Select Field
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";

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
};

const dataGen = () =>
  getDaysArray().map((date) => ({
    date,
    visits: getRandomInt(0, 200),
    clicks: getRandomInt(0, 20),
    sends: getRandomInt(0, 10),
  }));

/* const sliceByDateRange = (data: Data[], begin: Date, end: Date) =>
  data.filter((datum) => moment(datum.date).isBetween(begin, end)); */

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
  const [eventName, setEventName] = useState<EventName>("Site Visits");
  const [timeScale, setTimeScale] = useState<TimeScale>("Days");
  const data = aggregateByTimeScale(dataGen(), timeScale);
  console.log(dataGen());
  return (
    <>
      <Select
        label="Event Type"
        enhanced
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
        options={TimeScales}
        value={timeScale}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value as TimeScale;
          setTimeScale(value);
        }}
      />
      <LineChart width={1000} height={500} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
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

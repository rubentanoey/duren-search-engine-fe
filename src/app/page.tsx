"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Container, Dropdown, TextField } from "../components/elements";
import { HistoryProps, WeatherDataProps } from "./interfaces";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dateTime, setDateTime] = useState(new Date());
  const [searchValue, setSearchValue] = useState("");
  const [methodValue, setMethodValue] = useState("");
  const [isShowHistory, setIsShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState<Array<HistoryProps>>([]);
  const [weatherData, setWeatherData] = useState<WeatherDataProps>();
  const [weatherMain, setWeatherMain] = useState("");

  useEffect(() => {
    const deviceId = localStorage.getItem("device_id");

    if (!deviceId) {
      const newDeviceId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("device_id", newDeviceId);
    }
  }, []);

  const hour = dateTime.getHours();
  let greeting: string;

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleMethodChange = (selectedMethod: string) => {
    setMethodValue(selectedMethod);
  };

  const handleSearchClick = async (query?: string) => {
    try {
      const sanitizedMethod = methodValue.replace(/-/g, "");
      const lowercaseMethod = sanitizedMethod.toLowerCase();

      const params = new URLSearchParams(searchParams);
      params.delete("query");
      params.delete("method");
      params.set("query", !!query ? query : searchValue);
      params.set("method", !!lowercaseMethod ? lowercaseMethod : "bm25");

      router.push("/result" + "?" + params.toString());
    } catch (error) {
      // Handle errors
      console.error("Search error:", error);
    }
  };

  const handleHistory = async () => {
    try {
      const deviceId = localStorage.getItem("device_id");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/history`,
        {
          params: {
            device_id: deviceId,
          },
        }
      );
      setHistoryData(response.data.data);
      console.log("History success:", response.data);
    } catch (error) {
      console.error("History error:", error);
    }
  };

  const handleWeatherInfo = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=6.40&lon=106.79&appid=${process.env.NEXT_PUBLIC_WEATHER_API}`
      );
      setWeatherData(response.data);
      setWeatherMain(response.data.weather[0].main);
      console.log("Weather success:", response.data);
    } catch (error) {
      console.error("Weather error:", error);
    }
  };

  useEffect(() => {
    handleHistory();
  }, []);

  useEffect(() => {
    handleWeatherInfo();
  }, []);

  const formatTime = (time: string) => {
    const timeStr = time.split(" ")[1];
    const timeOnly = timeStr.replaceAll("-", ":");
    return timeOnly;
  };

  return (
    <main className="relative flex flex-col min-h-screen items-center justify-center p-12 bg-primary">
      <div className="w-[70%] flex flex-col items-center justify-center gap-5">
        <div className="flex flex-col gap-2 items-center">
          <div
            className="text-6xl text-primaryText font-black"
            suppressHydrationWarning
          >
            {dateTime.toLocaleString("en-US", { timeStyle: "short" })}
          </div>
          <div className="text-4xl text-secondaryText font-semibold">
            {greeting}
          </div>
        </div>

        <div className="flex flex-col w-full justify-center items-center">
          <Image
            src="/Cradren.svg"
            alt="Cradren"
            width={100}
            height={100}
          ></Image>

          <div className="relative top-[-42px] flex flex-row w-full bg-white py-3 px-5 items-center justify-center rounded-full">
            <TextField
              className="w-full"
              placeholder="You are safe to pry here :)"
              value={searchValue}
              onChange={handleSearchChange}
            />

            <div className="flex flex-row gap-2 items-center justify-center">
              <Dropdown
                className="w-40"
                placeholder="Select Method"
                value={methodValue}
                onChange={handleMethodChange}
              ></Dropdown>
              <svg
                width="2"
                height="30"
                viewBox="0 0 2 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0.5"
                  y1="30"
                  x2="0.5"
                  y2="0.5"
                  stroke="#CBE04C"
                  strokeWidth="2"
                />
              </svg>
              <Button
                className="bg-primaryText py-2 px-5"
                onClick={() => handleSearchClick()}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-10 w-[70%]">
        <div className="flex flex-col gap-4 w-[60%] rounded-2xl">
          <div className="flex flex-row items-center justify-start rounded-full gap-2">
            <Button
              className={`right-5 py-2 px-5 text-primaryText hover:scale-[102%] ${
                !isShowHistory ? "bg-icons" : "bg-icons/30"
              }`}
              onClick={() => setIsShowHistory(false)}
            >
              Shortcuts
            </Button>
            <Button
              className={`right-5 py-2 px-5 text-primaryText hover:scale-[102%] ${
                isShowHistory ? "bg-icons" : "bg-icons/30"
              }`}
              onClick={() => setIsShowHistory(true)}
            >
              History
            </Button>
          </div>

          {isShowHistory && (
            <div className="h-[240px] overflow-y-auto rounded-2xl">
              <div className="flex flex-col w-full justify-center items-center gap-4">
                {historyData.length == 0 && (
                  <div className="text-stone-500 text-lg font-normal">
                    No history found
                  </div>
                )}
                {historyData.map((data) => (
                  <Container
                    className="flex-col w-full gap-[8px] px-6 py-5"
                    key={data.date}
                  >
                    <div className="text-primaryText text-sm font-medium flex flex-row gap-2 items-center w-full">
                      {data.date}
                      <hr className="my-2 border border-gray-300" />
                    </div>
                    {data.queries.map((item, index) => (
                      <Container
                        className="px-3 py-2 flex w-full bg-white/70"
                        useAnimation
                        key={index}
                        onClick={() => handleSearchClick(item.query)}
                      >
                        <div className="flex w-full justify-between items-center gap-4">
                          <div className="text-stone-500 text-base font-semibold">
                            {item.query}
                          </div>
                          <div className="text-stone-400 text-base font-normal">
                            {formatTime(item.time)}
                          </div>
                        </div>
                      </Container>
                    ))}
                  </Container>
                ))}
              </div>
            </div>
          )}
          {!isShowHistory && (
            <div className="h-[240px] rounded-2xl">
              <div className="flex flex-wrap w-full justify-start items-between">
                <Container className="flex flex-col text-primaryText w-[33%] h-[116px] justify-center items-center bg-transparent hover:bg-primaryContainer">
                  <Image
                    src="YouTube.svg"
                    alt="YouTube"
                    height={40}
                    width={40}
                  ></Image>
                  YouTube
                </Container>
                <Container className="flex flex-col text-primaryText w-[33%] h-[116px] justify-center items-center bg-transparent hover:bg-primaryContainer">
                  <Image
                    src="Wiki.svg"
                    alt="Wiki"
                    height={40}
                    width={40}
                  ></Image>
                  Wiki
                </Container>
                <Container className="flex flex-col text-primaryText w-[33%] h-[116px] justify-center items-center bg-transparent hover:bg-primaryContainer">
                  <Image
                    src="Facebook.svg"
                    alt="Facebook"
                    height={40}
                    width={40}
                  ></Image>
                  Facebook
                </Container>
                <Container className="flex flex-col text-primaryText w-[33%] h-[116px] justify-center items-center bg-transparent hover:bg-primaryContainer">
                  <Image src="X.svg" alt="X" height={40} width={40}></Image>X
                </Container>
                <Container className="flex flex-col text-primaryText/70 w-[33%] h-[116px] justify-center items-center bg-transparent hover:bg-primaryContainer">
                  <Image src="Add.svg" alt="Add" height={40} width={40}></Image>
                  Add
                </Container>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 w-full rounded-2xl">
          <Container className="w-full h-full p-10">
            <div className="flex flex-col justify-end">
              <div className="text-5xl font-extrabold text-right text-primaryText">
                {weatherData?.main.temp &&
                  `${(weatherData.main.temp - 273.15).toFixed(0)}°C`}
              </div>
              <div className="text-xl font-semibold text-right text-primaryText/50">
                Depok
              </div>
            </div>
            <div className="">
              <Image
                className="relative bottom-[7%] right-[-8%]"
                src={`weather/${weatherMain}.svg`}
                alt={`${weatherMain}`}
                width={360}
                height={360}
                priority={false}
              ></Image>
            </div>
          </Container>
        </div>
      </div>
    </main>
  );
}

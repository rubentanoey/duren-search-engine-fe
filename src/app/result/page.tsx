"use client";

import { Pagination } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  TextField,
} from "../../components/elements";
import { DeocumentsResponseProps, DocumentsProps } from "../interfaces";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Result() {
  const router = useRouter();
  const searchParams = useSearchParams();
  let pageGiven = "1";

  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get("query") || ""
  );
  const [methodValue, setMethodValue] = useState<string>("");
  const [searchResult, setSearchResult] = useState<DeocumentsResponseProps>();
  const [timer, setTimer] = useState<number>();

  const hour = dateTime.getHours();
  let greeting;

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

  const handleSearchClick = () => {
    try {
      const sanitizedMethod = methodValue.replace(/-/g, "");
      const lowercaseMethod = sanitizedMethod.toLowerCase();

      const params = new URLSearchParams(searchParams);
      params.delete("query");
      params.delete("method");
      params.set("query", searchValue);
      params.set("method", !!lowercaseMethod ? lowercaseMethod : "bm25");

      router.push("/result" + "?" + params.toString());
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleDocumentClick = (doc_id: string) => {
    try {
      const params = new URLSearchParams(searchParams);
      params.delete("doc_id");
      params.set("doc_id", doc_id);
      router.push("/details" + "?" + params.toString());
      // console.log(doc_id);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSearchResult = async () => {
    const methodGiven = searchParams.get("method");
    const queryGiven = searchParams.get("query");
    setSearchResult(undefined);
    try {
      const deviceId = localStorage.getItem("device_id");
      console.log(deviceId);
      if (methodGiven?.includes("+")) {
        const substring = methodGiven.split("+");
        const method = substring[0];
        // set timer start
        const timerStart = new Date();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/search/${method}`,
          {
            params: {
              query: queryGiven,
              is_letor: true,
              page: pageGiven,
              device_id: deviceId,
            },
          }
        );
        // set timer end
        const timerEnd = new Date();
        const timeDiff = timerEnd.getTime() - timerStart.getTime();
        setTimer(timeDiff / 1000);
        setSearchResult(response.data);
        console.log("Search success:", response.data);
      } else {
        const timerStart = new Date();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/search/${methodGiven}`,
          {
            params: {
              query: queryGiven,
              is_letor: false,
              page: pageGiven,
              device_id: deviceId,
            },
          }
        );
        const timerEnd = new Date();
        const timeDiff = timerEnd.getTime() - timerStart.getTime();
        setTimer(timeDiff / 1000);
        setSearchResult(response.data);
        console.log("Search success:", response.data);
      }
    } catch (error) {
      // Handle errors
      console.error("Search error:", error);
    }
  };

  const handleHome = () => {
    router.push("/");
  };

  useEffect(() => {
    handleSearchResult();
  }, [searchParams]);

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    pageGiven = value.toString();
    handleSearchResult();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-5 bg-primary">
      <div className="relative flex flex-col gap-4 items-center justify-center my-12 w-[90%]">
        <div className="flex gap-4 items-center w-full">
          <div className="w-[10%] flex flex-col items-end">
            <div
              className="w-fit text-4xl text-primaryText font-extrabold text-right"
              suppressHydrationWarning
            >
              {dateTime.toLocaleString("en-US", { timeStyle: "short" })}
            </div>
            <div className="w-fit text-xl text-secondaryText font-semibold text-right">
              {greeting}
            </div>
          </div>

          <div className="w-full flex flex-row bg-white py-3 px-5 items-center justify-center rounded-full">
            <Button
              className="py-2 px-5 bg-primaryContainer text-primaryText mr-2"
              onClick={handleHome}
            >
              Home
            </Button>
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
                onClick={handleSearchClick}
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full">
          <svg
            width="100%"
            height="4"
            viewBox="0 0 1400 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="0" y1="0.5" x2="1400" y2="0.5" stroke="#F4F4E2" />
          </svg>
        </div>

        <div className="w-full flex text-sm items-center justify-center text-stone-400 ">
          <div>
            {searchResult?.total} documents are retrieved in {timer} seconds.
          </div>
          <Image
            src="/CradrenFast.svg"
            alt="Cradren Fast"
            width={70}
            height={70}
            onClick={() => {
              router.push("/");
            }}
          ></Image>
        </div>
        <div className="flex flex-col w-full justify-center items-center gap-4">
          {!searchResult ? (
            <AiOutlineLoading3Quarters
              className="animate-spin text-primaryText"
              size={30}
            />
          ) : searchResult.data.length == 0 ? (
            <div className="flex flex-col w-full px-12 justify-center items-center gap-5">
              <div className="text-stone-500 text-lg font-normal">
                No relevant documents found
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full px-12 justify-center items-center gap-5">
              {searchResult.data.map((result, index) => (
                <div
                  className="flex w-full gap-4"
                  key={index}
                  onClick={() => handleDocumentClick(result.id)}
                >
                  <Container className="flex w-full" useAnimation>
                    <div className="text-primaryText text-base font-bold">
                      {result.title}
                    </div>
                    <div className="line-clamp-3 text-stone-400 text-sm font-normal">
                      {result.preview}
                    </div>
                  </Container>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative top-4">
          <Pagination
            count={searchResult?.last_page}
            shape="rounded"
            onChange={handlePaginationChange}
          />
        </div>
      </div>
    </main>
  );
}

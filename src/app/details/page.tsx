"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button, Container } from "../../components/elements";
import { DocumentsProps } from "../interfaces";

export default function Details() {
  const [documentDetail, setDocumentDetail] = useState<DocumentsProps>();
  const [relDocsList, setRelDocsList] = useState<Array<DocumentsProps>>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const doc_idGiven = searchParams.get("doc_id");

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.push("/");
  };

  const handleDocument = async () => {
    setDocumentDetail(undefined);
    if (doc_idGiven) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/document/${doc_idGiven}`
        );
        setDocumentDetail(response.data);
        console.log("Search success:", response.data);
      } catch (error) {
        // Handle errors
        console.error("Search error:", error);
      }
    } else {
      console.log("Search error: No document id given");
    }
  };

  const handleRelDocs = async () => {
    setRelDocsList(undefined);
    if (doc_idGiven) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/related/${doc_idGiven}`
        );
        setRelDocsList(response.data.data);
        console.log("Search success:", response.data);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      console.log("Search error: No document id given");
    }
  };

  useEffect(() => {
    handleDocument();
  }, [searchParams]);

  useEffect(() => {
    handleRelDocs();
  }, [searchParams]);

  const handleDocumentClick = (doc_id: string) => {
    try {
      const params = new URLSearchParams(searchParams);
      params.delete("doc_id");
      params.set("doc_id", doc_id);
      router.push("/details" + "?" + params.toString());
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-5 bg-primary">
      <div className="relative flex flex-col gap-8 items-center justify-center px-4 py-12 md:my-12 md:px-0 md:py-0 md:w-[70%]">
        {!!documentDetail ? (
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-row w-full justify-between">
                <Button
                  className=" md:hidden py-2 px-5 bg-primaryText"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  className=" md:hidden py-2 px-5 bg-primaryContainer text-primaryText"
                  onClick={handleHome}
                >
                  Home
                </Button>
              </div>

              <div className="w-full flex flex-row bg-white py-3 px-5 items-center justify-center rounded-full">
                <Button
                  className="hidden md:flex py-2 px-5 bg-primaryText"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <div className="text-primaryText text-lg md:text-2xl font-bold w-full text-center">
                  {documentDetail?.title}
                </div>
                <Button
                  className="hidden md:flex py-2 px-5 bg-primaryContainer text-primaryText"
                  onClick={handleHome}
                >
                  Home
                </Button>
              </div>
            </div>
            <div className="w-full text-stone-500 text-sm md:text-lg px-4 md:px-12">
              {documentDetail?.content}
            </div>
          </div>
        ) : (
          <AiOutlineLoading3Quarters
            className="animate-spin text-primaryText"
            size={30}
          />
        )}
        <div className="flex flex-col w-full md:px-12 justify-center items-center gap-5">
          <Image
            src="/Cradren.svg"
            alt="Cradren"
            width={60}
            height={60}
          ></Image>
          <div className="text-secondaryText text-xl font-bold">
            Relevant Documents:
          </div>
        </div>
        {!!relDocsList ? (
          relDocsList.length == 0 ? (
            <div className="flex flex-col w-full md:px-12 justify-center items-center gap-5">
              <div className="text-stone-500 text-lg font-normal">
                No relevant documents found
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full md:px-12 justify-center items-center gap-5">
              {relDocsList.map((result, index) => (
                <div
                  className="flex w-full gap-4"
                  key={index}
                  onClick={() => handleDocumentClick(result.id)}
                >
                  <Container
                    className="flex flex-col md:flex-row w-full px-6 py-4 gap-0 md:gap-4"
                    useAnimation
                  >
                    <div className="w-full md:w-fit text-primaryText text-base font-bold text-start">
                      {result.title}
                    </div>
                    <div className="w-full md:w-fit line-clamp-3 text-stone-400 text-sm font-normal text-start">
                      {result.preview}
                    </div>
                  </Container>
                </div>
              ))}
            </div>
          )
        ) : (
          <AiOutlineLoading3Quarters
            className="animate-spin text-primaryText"
            size={30}
          />
        )}
      </div>
    </main>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Languages,
  Speaker,
  Star,
  Users,
  Vote,
} from "lucide-react";

function HeroCard() {
  const [movies, setMovies] = useState<
    {
      id: number;
      title: string;
      backdrop_path: string;
      poster_path: string;
      overview: string;
      vote_average: number;
      original_language: string;
      popularity: number;
      release_date: string;
      vote_count: number;
    }[]
  >([]);
  const [highlighted, setHighlighted] = useState<number>(0);
  const [tempHighlighted, setTempHighlighted] = useState<number>(0);
  const tempBackdrop = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const progress = useRef<HTMLDivElement>(null);
  const backdropTimeline = useRef<gsap.core.Timeline | null>(null);
  const progressTimeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (tempBackdrop.current) {
      console.log(
        "Animation triggered! temp highlighted: ",
        tempHighlighted,
        "highlighted: ",
        highlighted,
      );

      backdropTimeline.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          setTempHighlighted(highlighted);
          animating.current = false;
        },
      });
      backdropTimeline.current = tl;

      // Reset to full visibility first
      tl.set(tempBackdrop.current, {
        opacity: 1,
        scale: 1,
      });

      // Then animate out
      tl.to(tempBackdrop.current, {
        opacity: 0,
        // scale: 0.1,
        duration: 1,
      });

      return () => {
        backdropTimeline.current?.kill();
      };
    }
  }, [highlighted]);

  useGSAP(() => {
    if (progress.current && movies.length > 0) {
      progressTimeline.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          setHighlighted((prev) => (prev + 1) % movies.length);
        },
      });
      progressTimeline.current = tl;
      tl.to(progress.current, {
        width: "0%",
        duration: 0.5,
      });
      tl.to(progress.current, {
        width: "100%",
        duration: 8,
        ease: "linear",
      });

      return () => {
        progressTimeline.current?.kill();
      };
    }
  }, [highlighted, movies]);

  useEffect(() => {
    fetch("/api/tmdb?route=movie/popular")
      .then((res) => res.json())
      .then((data) => setMovies(data.results))
      .then(() => console.log(movies));
  }, []);

  return (
    <div className="w-full h-screen p-24 overflow-hidden relative">
      {movies.length > 0 && movies[highlighted] ? (
        <div
          className="relative w-full overflow-hidden rounded-lg h-full flex flex-col justify-end gap-2 bg-gray-800 p-5 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://image.tmdb.org/t/p/w1280${movies[highlighted].backdrop_path}')`,
          }}
        >
          <div
            ref={tempBackdrop}
            className="absolute top-0 left-0 w-full rounded-lg h-full flex flex-col justify-end gap-2 bg-gray-800 p-5 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://image.tmdb.org/t/p/w1280${movies[tempHighlighted].backdrop_path}')`,
            }}
          ></div>
          <div className="bg-black/40 h-full w-full z-0 absolute top-0 left-0"></div>
          <div className=" absolute top-0 right-0 w-fit h-30 gap-10 bg-white/40 backdrop-blur-lg rounded-bl-2xl flex justify-center items-center z-10">
            <div className="flex flex-col w-20 gap-2 justify-center items-center ">
              <div className=" h-15 w-15 bg-white rounded-full flex items-center justify-center " >

              <Star className="text-black" />
              </div>
              <p className="text-black text-lg font-bold">
                {movies[highlighted].vote_average}
              </p>
            </div>
            <div className="flex flex-col w-20 gap-2 justify-center items-center ">
              <div className=" h-15 w-15 bg-white rounded-full flex items-center justify-center " >

              <Vote className="text-black" />
              </div>
              <p className="text-black text-lg font-bold">
                {movies[highlighted].vote_count}
              </p>
            </div>
            <div className="flex flex-col w-20 gap-2 justify-center items-center ">
              <div className=" h-15 w-15 bg-white rounded-full flex items-center justify-center " >

              <Languages className="text-black" />
              </div>
              <p className="text-black text-lg font-bold">
                {movies[highlighted].original_language.toUpperCase()}
              </p>
            </div>
            <div className="flex flex-col w-20 gap-2 justify-center items-center ">
              <div className=" h-15 w-15 bg-white rounded-full flex items-center justify-center " >

              <Calendar className="text-black" />
              </div>
              <p className="text-black text-lg font-bold">
                {movies[highlighted].release_date.slice(0, 4)}
              </p>
            </div>
          </div>
          <div className="flex overflow-auto p-2 rounded-2xl items-center gap-2 ">
            <div className="relative overflow-hidden flex min-w-fit bg-black p-5 items-center gap-10 rounded-2xl h-full ">
              <div
                className="absolute bottom-0 left-0 h-full mix-blend-exclusion w-0 bg-white rounded-md"
                ref={progress}
              ></div>
              <div
                className="relative w-35 h-45 bg-gray-800 rounded-md bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://image.tmdb.org/t/p/w185${movies[highlighted % movies.length].poster_path}')`,
                }}
              ></div>
              <div className="mix-blend-exclusion flex flex-col items-start gap-5">
                <h2 className="relative text-3xl w-100 text-white">
                  {movies[highlighted].title.length < 25
                    ? movies[highlighted].title
                    : movies[highlighted].title.slice(0, 25) + "..."}
                </h2>
                <p className="relative w-100 text-white">
                  {movies[highlighted].overview.length < 150
                    ? movies[highlighted].overview
                    : movies[highlighted].overview.slice(0, 150) + "..."}
                </p>
                <div className=" w-10 flex gap-2">
                  <div
                    className="cursor-pointer min-h-10 min-w-10 flex justify-center items-center rounded-full bg-white"
                    onClick={() => {
                      if (!animating.current) {
                        animating.current = true;
                        setHighlighted(
                          (highlighted - 1 + movies.length) % movies.length,
                        );
                      }
                    }}
                  >
                    <ChevronLeft className="text-black" />
                  </div>
                  <button className=" py-2 px-6 rounded-xl bg-white text-black ">
                    Open
                  </button>
                  <div
                    className="cursor-pointer min-h-10 min-w-10 flex justify-center items-center rounded-full bg-white"
                    onClick={() => {
                      if (!animating.current) {
                        animating.current = true;
                        setHighlighted((highlighted + 1) % movies.length);
                      }
                    }}
                  >
                    <ChevronRight className="text-black" />
                  </div>
                </div>
              </div>
            </div>
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="relative overflow-hidden min-w-40 max-w-40 group relateive cursor-pointer flex flex-col justify-end transition-all duration-100 rounded-2xl h-60 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://image.tmdb.org/t/p/w500${movies[(index + highlighted + 1) % movies.length].poster_path}')`,
                }}
                onClick={() => {
                  if (!animating.current) {
                    animating.current = true;
                    setHighlighted((highlighted + index + 1) % movies.length);
                  }
                }}
              >
                <div className="absolute w-full h-0 group-hover:h-full bottom-0 bg-linear-to-t from-black from-20% to-80% to-transparent transition-all duration-300"></div>
                <h3 className="text-transparent group-hover:text-white translate-y-10 group-hover:translate-y-0 transition-all duration-300 text-center text-xl relative p-2 ">
                  {movies[(index + highlighted + 1) % movies.length].title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="skeletal-loading relative overflow-hidden w-full rounded-lg h-full flex flex-col justify-end gap-2 bg-gray-800 p-5 bg-cover bg-center">
          <div className="flex gap-10">
            <div className="relative overflow-hidden flex min-w-200 max-w-200 h-fit bg-black p-5 items-center gap-10 rounded-2xl ">
              <div className="relative w-35 h-45 bg-gray-200 rounded-md bg-cover bg-center skeletal-loading"></div>
            </div>
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="relative skeletal-loading bg-gray-200 rounded-md overflow-hidden min-w-40 max-w-40"
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroCard;

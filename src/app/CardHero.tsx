"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function HeroCard() {
    const [movies, setMovies] = useState<
        {
            id: number;
            title: string;
            backdrop_path: string;
            poster_path: string;
            overview: string;
        }[]
    >([]);
    const [highlighted, setHighlighted] = useState<number>(10);
    const [tempHighlighted, setTempHighlighted] = useState<number>(10);
    const tempBackdrop = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (tempBackdrop.current) {
            console.log("Animation triggered! temp highlighted: ", tempHighlighted, "highlighted: ", highlighted);
            
            const tl = gsap.timeline({
                onComplete: () => {
                    setTempHighlighted(highlighted);
                },
            });
            
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
        }
    }, [highlighted]);

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
                    className="relative w-full rounded-lg h-full flex flex-col justify-end gap-2 bg-gray-800 p-5 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://image.tmdb.org/t/p/w1280${movies[highlighted].backdrop_path}')`,
                    }}
                >
                    <div
                    ref={tempBackdrop}
                    className="absolute top-0 left-0 w-full rounded-lg h-full flex flex-col justify-end gap-2 bg-gray-800 p-5 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://image.tmdb.org/t/p/w1280${movies[tempHighlighted].backdrop_path}')`,
                    }}></div>
                    <div className="bg-black/40 h-full w-full z-0 absolute top-0 left-0"></div>
                    <div className="flex overflow-auto p-2 rounded-2xl gap-2 ">
                        <div className="relative overflow-hidden flex min-w-200 bg-black p-5 items-center gap-10 rounded-2xl h-full ">
                            <div className="absolute bottom-0 left-0 h-full mix-blend-exclusion w-0 bg-white"></div>
                            <div
                                className="relative w-35 h-45 bg-gray-800 rounded-md bg-cover bg-center"
                                style={{
                                    backgroundImage: `url('https://image.tmdb.org/t/p/w185${movies[highlighted % movies.length].poster_path}')`,
                                }}
                            ></div>
                            <div className="mix-blend-exclusion">
                                <h2 className="relative text-3xl text-white">
                                    {movies[highlighted].title}
                                </h2>
                                <p className="relative w-100 text-white">
                                    {movies[highlighted].overview.length < 30
                                        ? movies[highlighted].overview
                                        : movies[highlighted].overview
                                              .split(" ")
                                              .slice(0, 30)
                                              .join(" ") + "..."}
                                </p>
                            </div>
                        </div>
                        {[0, 1, 2, 3, 4].map((index) => (
                            <div
                                key={index}
                                className="relative overflow-hidden min-w-40 max-w-40 group relateive cursor-pointer flex flex-col justify-end transition-all duration-100 rounded-2xl h-60 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url('https://image.tmdb.org/t/p/w500${movies[(index + highlighted + 1) % movies.length].poster_path}')`
                                }}
                                onClick={() =>
                                    setHighlighted(
                                        (highlighted + index + 1) %
                                            movies.length,
                                    )
                                }
                            >
                                <div className="absolute w-full h-0 group-hover:h-full bottom-0 bg-linear-to-t from-black from-20% to-80% to-transparent transition-all duration-300"></div>
                                <h3 className="text-transparent group-hover:text-white translate-y-10 group-hover:translate-y-0 transition-all duration-300 text-center text-xl relative p-2 ">
                                    {
                                        movies[
                                            (index + highlighted + 1) %
                                                movies.length
                                        ].title
                                    }
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="skeletal-loading relative  w-full rounded-lg h-full flex flex-col justify-end gap-2 bg-gray-800 p-5 bg-cover bg-center">
                    <div className="flex gap-10" >

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

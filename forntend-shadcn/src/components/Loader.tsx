import { useState, CSSProperties } from "react";
import FadeLoader from "react-spinners/FadeLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Loader = () => {
    return (
        <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px]">
            <div className="flex flex-col justify-center items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[15px] min-h-[300px]">
                <FadeLoader
                    color="#335fff"
                    cssOverride={override}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </div>
    )
}

export default Loader;
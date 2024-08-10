const SigninOrSignUp = () => {
    return (
        <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px]">
            <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[15px]">
                <button
                    className="flex justify-center text-white items-center bg-[#335fff] w-[75%] max-w-[300px] py-[15px] font-bold rounded-[25px] mt-[40px] cursor-pointer"
                >
                    Sign Up
                </button>
                <button
                    className="flex justify-center text-white items-center bg-[#335fff] w-[75%] max-w-[300px] py-[15px] font-bold rounded-[25px] my-[40px] cursor-pointer"
                >
                    Sign In
                </button>
            </div>
        </div>
    )
}

export default SigninOrSignUp
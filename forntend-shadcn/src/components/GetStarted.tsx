// import wallet from "../assets/test.svg"

const GetStarted = () => {
  return (
    <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px] text-white">
        <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[15px]">
            <div className="flex w-full my-[70px] lg:my-[40px] justify-center">
                <img className="w-[50%] max-w-[200px]" src="https://cdn3d.iconscout.com/3d/premium/thumb/cryptocurrency-wallet-11199371-8998278.png" alt="" />
            </div>
            <div className="font-medium text-[#ffffffad] text-[1.5em] lg:text-[1.3em]">Welcome to</div>
            <div className="font-bold text-[3em] lg:text-[2.2em]">PayPaya</div>
            <div className="flex justify-center items-center bg-[#335fff] w-[75%] max-w-[300px] py-[15px] font-bold rounded-[25px] my-[40px] cursor-pointer">Get Started</div>
        </div>
    </div>
  )
}

export default GetStarted
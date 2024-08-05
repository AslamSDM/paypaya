const options = [
  {
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAPFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHr/7WAAAAFHRSTlMAJ2J+iTQXmv+1BOzTUt3FQaM8Qxpb+LkAAADQSURBVHgBfJKFEcMwDABl/jDtv2urC8kp/IFBDHLjfIjBJ/kkF04aJzUFS9Nasw7ovdPr0AC4WwaM5jkBZ+gWKGLxQN6vE0RRXCg7cYROlAEaPXNPRZA3I+gx80R9QdwPlj3O6W8QCXvsUR8WNNjEuBsWqWjUb8eU1lRgWC1pgVb4Tf4rVLfrtqrbeTOs6vZ/QvFfKQ7Cbkqpm+DfRwf62nhiG+/GZ+OV6by4sOwUHdk97CiW4R52m4HerEkDrPWCTT7fC5Zew5s0CSdqvNkBAB8pD27Wz4UiAAAAAElFTkSuQmCC",
    text: "Connect with WorldCoin"
  },
  {
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAYFBMVEX////LvuighNeJY8+FXc3m3/SAVct9UcqCWMx4SMmDWsx8T8rv6/jp4/V7TMlxPcb6+f3BseSUc9PAr+Svmd3QxOqXd9Ogg9eznt63o+D29PvWy+3NwOmslNynjtrg2PEtzGXuAAAA9UlEQVR4Ac3TV7bDIAxFUQE3EhbpvWf+s3wPQbrLb/anfZZNpcz5gC/BOypGLBEtovDI3jfo1OQiKjppJHICw/KGYcSRLx9IY3ozTuUTngJMmtCbSYIJZB+aTmefwWw6neJfDmQ0n8/pQ36kNeAFtZqkGuiSWq24BuA1tdggI7x+YrNMabl5/UANtmR2SQFNnsziK9gLjBzag2ODajpvDTaCSk6tgWNU7H43kJfgfSWjLfU5oZLyBXkEzZGyS0QRyQTNQQDilcxNYXhFmQ0qkNfngb2WYkqVQL0NjaVQFFKV0TB6sF09RQdtyuWM0pqoqL0fuP5/gMsRGgmk9rgAAAAASUVORK5CYII=",
    text: "Connect with Farcaster"
  }
]

const Connect = () => {


  return (
    <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px]">
      <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[30px]">
        <div className="text-white text-[2em] font-bold my-[40px]">Connect</div>
        <div className="flex flex-col items-center w-[70%] gap-[20px]">
          {
            options.map((option, i) => {
              return (
                <div className="flex w-full p-[10px] rounded-[5px] gap-[15px] px-[20px] border border-[#ffffff1f] bg-[#ffffff05] hover:bg-[#ffffff1f] cursor-pointer">
                  <div className="flex justify-center items-center bg-white rounded-[50%]">
                    <img className="h-[30px]" src={option.icon} alt={option.text} />
                  </div>
                  <div className="text-white font-semibold">{option.text}</div>
                </div>
              )
            })
          }
        </div>
        <div className="text-[#ffffff68] text-sm my-[20px]">OR</div>
        <div className="flex w-[70%] p-[10px] rounded-[5px] gap-[15px] px-[20px] border border-[#ffffff1f] bg-[#ffffff05] hover:bg-[#ffffff1f] cursor-pointer">
          <div className="flex justify-center items-center">
            <img className="h-[30px] rounded-sm" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJZaVpfhv3kgZA46GoqfVNIFhR6pXIdX4_Rg&s" alt="Wallet" />
          </div>
          <div className="text-white font-semibold">Conncet with any EVM Wallet</div>
        </div>
      </div>
    </div>
  )
}

export default Connect;
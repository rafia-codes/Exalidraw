import React from 'react'
import { ReactNode } from 'react'

function IconButton({icon,onClick,activated}:{
    icon: ReactNode,
    onClick: ()=> void,
    activated: boolean
}) {
  return (
    <div className={`pointer rounded-full border p-2 ${activated?"bg-violet-900":"bg-black"} hover:bg-gray text-white`} onClick={onClick}>
      {icon}
    </div>
  )
}

export default IconButton;

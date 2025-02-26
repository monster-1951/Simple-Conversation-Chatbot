import Chat from '@/components/custom/Chat'
import {  pirateQuestions } from '@/constants/commonQuestion'
import React from 'react'

const page = () => {
  return (
    <>
    <Chat Person= "Pirate" commonQuestions={pirateQuestions}/>
    </>
  )
}

export default page
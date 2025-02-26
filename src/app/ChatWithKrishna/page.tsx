import Chat from '@/components/custom/Chat'
import { krishnaQuestions } from '@/constants/commonQuestion'
import React from 'react'

const page = () => {
  return (
    <>
    <Chat Person="Krishna" commonQuestions={krishnaQuestions}/>
    </>
  )
}

export default page
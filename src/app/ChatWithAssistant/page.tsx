import Chat from '@/components/custom/Chat'
import { aiAssistantQuestions } from '@/constants/commonQuestion'
import React from 'react'

const page = () => {
  return (
    <>
    <Chat Person="Assistant" commonQuestions={aiAssistantQuestions}/>
    </>
  )
}

export default page
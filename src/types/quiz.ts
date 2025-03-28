export interface IQuizQuestion {
  id: number
  title: string
  question: string
  options: string[]
  correctOptionIndex: number
}

export interface IQuestionAnswer {
  questionId: number
  answer: number
}

export interface IQuiz {
  id: number
  name: string
  description: string
  questions: IQuizQuestion[]
}

export interface IQuizSubmission {
  quizId: number
  answers: IQuestionAnswer[]
  phoneNumber: string
}

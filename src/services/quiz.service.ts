import type { IQuiz, IQuizSubmission } from '@/types/quiz'

const sampleQuizzes: IQuiz[] = [
  {
    id: 1,
    name: 'General Knowledge Quiz',
    description: 'Test your general knowledge with these questions!',
    questions: [
      {
        id: 1,
        title: 'Geography',
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin'],
        correctOptionIndex: 0
      },
      {
        id: 2,
        title: 'Science',
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter'],
        correctOptionIndex: 1
      },
      {
        id: 3,
        title: 'History',
        question: 'Who painted the Mona Lisa?',
        options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso'],
        correctOptionIndex: 1
      },
      {
        id: 4,
        title: 'Literature',
        question: 'Who wrote "Romeo and Juliet"?',
        options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen'],
        correctOptionIndex: 1
      },
      {
        id: 5,
        title: 'Sports',
        question: 'In which sport would you perform a slam dunk?',
        options: ['Soccer', 'Basketball', 'Tennis'],
        correctOptionIndex: 1
      }
    ]
  }
]

export const quizService = {
  getQuizzes (): Promise<IQuiz[]> {
    return Promise.resolve(sampleQuizzes)
  },

  getQuizById (id: number): Promise<IQuiz | undefined> {
    const quiz = sampleQuizzes.find(q => q.id === id)
    return Promise.resolve(quiz)
  },

  submitResults (data: IQuizSubmission): Promise<{ success: boolean }> {
    console.log('Submitting quiz results to API:', data)
    console.log(`Quiz ID: ${data.quizId}`)
    console.log(`Phone Number: ${data.phoneNumber}`)
    console.log('Answers:', data.answers)

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  }
}

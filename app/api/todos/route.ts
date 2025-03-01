import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { TodoCreate } from '@/types/todo'

const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  try {
    const response = await axios.get(`${API_URL}/todos?id=${id}`)
    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const todoData: TodoCreate = await request.json()
    const response = await axios.post(`${API_URL}/todos`, todoData)
    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

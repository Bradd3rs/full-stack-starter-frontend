import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { TodoUpdate } from '@/types/todo'

const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    const response = await axios.get(`${API_URL}/todos/${id}`)
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

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    const todoData: TodoUpdate = await request.json()
    const response = await axios.put(`${API_URL}/todos/${id}`, todoData)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    await axios.delete(`${API_URL}/todos/${id}`)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

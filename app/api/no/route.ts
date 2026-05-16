import { NextResponse } from 'next/server';
import reasons from './reasons.json';

export async function GET() {
  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  return NextResponse.json({
    reason,
    timestamp: new Date().toISOString(),
    service: "No-as-a-Service"
  }, { status: 200 });
}

export async function POST() {
  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  return NextResponse.json({
    reason,
    timestamp: new Date().toISOString(),
    service: "No-as-a-Service"
  }, { status: 200 });
}

export async function PUT() {
  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  return NextResponse.json({
    reason,
    timestamp: new Date().toISOString(),
    service: "No-as-a-Service"
  }, { status: 200 });
}

export async function DELETE() {
  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  return NextResponse.json({
    reason,
    timestamp: new Date().toISOString(),
    service: "No-as-a-Service"
  }, { status: 200 });
}

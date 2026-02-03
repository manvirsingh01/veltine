import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Create data directory if it doesn't exist
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Load existing messages or create new array
        const messagesFile = path.join(dataDir, 'messages.json');
        let messages = [];
        if (fs.existsSync(messagesFile)) {
            const fileContent = fs.readFileSync(messagesFile, 'utf-8');
            messages = JSON.parse(fileContent);
        }

        // Save image if provided
        let imagePath = null;
        if (data.image) {
            const imagesDir = path.join(dataDir, 'images');
            if (!fs.existsSync(imagesDir)) {
                fs.mkdirSync(imagesDir, { recursive: true });
            }

            // Extract base64 data and save as file
            const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            const fileName = `lucky_${Date.now()}.png`;
            imagePath = path.join(imagesDir, fileName);
            fs.writeFileSync(imagePath, imageBuffer);
            imagePath = `/data/images/${fileName}`;
        }

        // Add new message
        const newMessage = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            reaction: data.reaction || '',
            message: data.message || '',
            imagePath: imagePath,
        };

        messages.push(newMessage);

        // Save messages
        fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

        return NextResponse.json({ success: true, message: 'Data saved!' });
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const messagesFile = path.join(process.cwd(), 'data', 'messages.json');

        if (fs.existsSync(messagesFile)) {
            const fileContent = fs.readFileSync(messagesFile, 'utf-8');
            const messages = JSON.parse(fileContent);
            return NextResponse.json({ success: true, messages });
        }

        return NextResponse.json({ success: true, messages: [] });
    } catch (error) {
        console.error('Error reading data:', error);
        return NextResponse.json({ success: false, error: 'Failed to read data' }, { status: 500 });
    }
}

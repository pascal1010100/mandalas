import fs from 'fs'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')

console.log('--- Env Keys Available ---')
envContent.split('\n').forEach(line => {
    const [key] = line.split('=')
    if (key) console.log(key.trim())
})

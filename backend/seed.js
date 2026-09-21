import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, active: Boolean }, { timestamps: true })
const taskSchema = new mongoose.Schema({ title: String, description: String, assignedTo: mongoose.Schema.Types.ObjectId, createdBy: mongoose.Schema.Types.ObjectId, priority: String, status: String, deadline: Date }, { timestamps: true })
const User = mongoose.model('User', userSchema); const Task = mongoose.model('Task', taskSchema)
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/northstar')
await User.deleteMany({}); await Task.deleteMany({})
const password = await bcrypt.hash('Northstar123!', 12); const [admin, manager, employee] = await User.create([{ name: 'Alex Morgan', email: 'admin@northstar.io', password, role: 'ADMIN' }, { name: 'Jordan Lee', email: 'manager@northstar.io', password, role: 'MANAGER' }, { name: 'Taylor Kim', email: 'employee@northstar.io', password, role: 'EMPLOYEE' }])
await Task.create([{ title: 'Prepare launch brief', description: 'Align the launch brief with current customer insights.', assignedTo: employee._id, createdBy: manager._id, priority: 'HIGH', status: 'IN_PROGRESS', deadline: new Date(Date.now() + 86400000 * 4) }, { title: 'Review quarterly report', description: 'Review KPI definitions before the planning meeting.', assignedTo: manager._id, createdBy: admin._id, priority: 'MEDIUM', status: 'TODO', deadline: new Date(Date.now() + 86400000 * 7) }])
console.log('Seeded Northstar demo data. Password for all accounts: Northstar123!'); await mongoose.disconnect()

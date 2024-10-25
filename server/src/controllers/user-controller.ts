import type { Request, Response } from "express"

import user from "../model/User"

export const getUsers = async (req: Request, res: Response) => {
	const users = await user.find()
	res.status(200).json(users)
	res.send("GET /api/user")
}

export const getUserById = async (req: Request, res: Response) => {
	const { id } = req.params
	if (!id) {
		res.status(400).json({ message: "Missing user ID" })
		return
	}

	try {
		const foundUser = await user.findById(id)
		if (!foundUser) {
			res.status(404).json({ message: "User not found" })
			return
		}

		res.status(200).json(foundUser)
	} catch (error: any) {
		res.status(400).json({ message: error.message })
	}
}

export const createUser = async (req: Request, res: Response) => {
	const { name, email } = req.body

	if (!name || !email) {
		res.status(400).json({ message: "Missing required fields" })
		return
	}
	const newUser = new user(req.body)

	try {
		await newUser.save()
		// implement logic to send user confirmation email
		res.status(200).json(newUser)
	} catch (error: any) {
		res.status(400).json({ message: error.message })
	}
}

export const updateUser = async (req: Request, res: Response) => {
	const updatedUser = req.body

	const editUser = new user(updatedUser)
	try {
		await user.findByIdAndUpdate(
			{
				_id: req.params.id,
			},
			editUser,
			{ new: true }
		)
	} catch (error: any) {
		res.status(400).json({ message: error.message })
	}
}

export const deleteUser = async (req: Request, res: Response) => {
	try {
		await user.findByIdAndDelete({
			_id: req.params.id,
		})
		res.status(204).send("User deleted")
	} catch (error: any) {
		res.status(400).json({ message: error.message })
	}
}

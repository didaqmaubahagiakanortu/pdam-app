"use client"

import { Services } from "@/app/types"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

const EditService = ({selectedData}: {selectedData: Services}) => {
    const router = useRouter()

    const [name, setName] = useState<string>("")
    const [min_usage, setMinUsage] = useState<number>(0)
    const [max_usage, setMaxUsage] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)

    const openModal = () => {
        setName(selectedData.name)
        setMinUsage(selectedData.min_usage)
        setMaxUsage(selectedData.max_usage)
        setPrice(selectedData.price)
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()

            const token = await getCookie("accessToken")
            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services/${selectedData.id}`
            const payload = JSON.stringify({name, min_usage, max_usage, price})

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    Authorization: `Bearer ${token}`
                },
                body: payload
            })

            const result = await response.json()
            if (result?.success) {
                toast.success(result.message)
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast.warning(result.message)
            }
        } catch (error) {
            toast.error(`Something went wrong, ${error}`)
        }
    }
}
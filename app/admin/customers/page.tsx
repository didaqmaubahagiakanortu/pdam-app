import { Customer } from "@/app/types"
import { getCookies } from "@/lib/server-cookies"

type ResultData = {
    success: boolean
    message: string
    data: Customer[]
    count: number
}

async function getCustomersAdmin(): Promise<Customer[]> {
    try {
        const token = await getCookies("accessToken")
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers`

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        })

        const ResponseData: ResultData = await response.json()

        if (!response.ok) {
            console.log(ResponseData.message)
            return []
        }

        return ResponseData.data

    } catch (error) {
        console.log(error)
        return []
    }
}

export default async function AdminCustomersPage() {
    const customers = await getCustomersAdmin()
    return (
        <div className="min-w-screen h-full bg-blue-50 p-5">
            <div className="bg-white p-5">
                {
                    customers.length == 0 ? "Data customer tidak ada" : 
                    <div className="grid grid-cols-3 gap-3">
                        {customers.map((customer) => (
                            <div key={customer.id} className="shadow-lg my-3 p-5 text-blue-500">
                                <h2 className="mb-2 text-xl text-blue-800 font-semibold">{customer.name}</h2>
                                <p>Phone: {customer.phone}</p>
                                <p>Address: {customer.address}</p>
                                <p>Services: {customer.service.name}</p>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}
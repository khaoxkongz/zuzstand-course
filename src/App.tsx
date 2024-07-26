import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CircleX, Minus, Plus, ShoppingCart, Trash2, UserIcon } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Button } from './components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { PRODUCTS_DATA } from './lib/mock-data'
import { useStore } from './store/store'

const ChangeQtyButtons: React.FC<{ productId: string }> = ({ productId }) => {
	const { incQty, decQty, setTotal, getProductById } = useStore(
		useShallow((state) => ({
			incQty: state.incQty,
			decQty: state.decQty,
			setTotal: state.setTotal,
			getProductById: state.getProductById,
		})),
	)

	const storeProduct = getProductById(productId)

	useEffect(() => {
		const unSub = useStore.subscribe(
			(state) => state.products,
			(products) => {
				setTotal(products.reduce((acc, item) => acc + item.price * item.qty, 0))
			},
			{ fireImmediately: true },
		)
		return unSub
	}, [setTotal])

	return (
		<>
			{storeProduct && (
				<div className='flex gap-2 items-center'>
					<Button onClick={() => decQty(storeProduct.id)} variant='default'>
						<Minus />
					</Button>
					<div>{storeProduct.qty}</div>
					<Button onClick={() => incQty(storeProduct.id)} variant='default'>
						<Plus />
					</Button>
				</div>
			)}
		</>
	)
}

const User: React.FC = () => {
	const { fullName, userName, address, setAddress, fetchUser } = useStore(
		useShallow((state) => ({
			fullName: state.fullName,
			userName: state.userName,
			address: state.address,
			setAddress: state.setAddress,
			fetchUser: state.fetchUser,
		})),
	)

	const fetchData = useCallback(async () => {
		await fetchUser()
	}, [fetchUser])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='secondary' size='icon' className='mt-1'>
					<UserIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='overflow-y-scroll space-y-2 w-96'>
				<div className='flex items-center gap-2'>
					<p>{fullName}</p>
					<p>{userName}</p>
				</div>
				<Label htmlFor='address'>Your Address:</Label>
				<Input id='address' value={address} onChange={(e) => setAddress(e.target.value)} />
			</PopoverContent>
		</Popover>
	)
}

const Cart: React.FC = () => {
	const { total, address, storeProducts, reset, removeProduct } = useStore(
		useShallow((state) => ({
			total: state.total,
			address: state.address,
			storeProducts: state.products,
			reset: state.reset,
			removeProduct: state.removeProduct,
		})),
	)

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='secondary' size='icon' className='mt-1'>
					<ShoppingCart />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='overflow-y-scroll space-y-2 w-96'>
				<div className='flex justify-between items-center gap-6'>
					<h1>Cart:</h1>
					<Button onClick={reset} variant='destructive' size='icon'>
						<CircleX />
					</Button>
				</div>
				<div className='space-y-2'>
					{storeProducts.map((storeProduct) => (
						<Card className='flex flex-col' key={storeProduct.id}>
							<CardHeader className='flex flex-row justify-between items-center gap-2'>
								<CardTitle>{storeProduct.title}</CardTitle>
								<Button onClick={() => removeProduct(storeProduct.id)} variant='destructive' size='icon'>
									<Trash2 />
								</Button>
							</CardHeader>
							<CardContent>{storeProduct.price}$</CardContent>
							<CardFooter>
								<ChangeQtyButtons key={storeProduct.id} productId={storeProduct.id} />
							</CardFooter>
						</Card>
					))}
				</div>
				<p>Total: {total}$</p>
				<p>Address: {address}</p>
			</PopoverContent>
		</Popover>
	)
}

export default function App() {
	const { storeProducts, addProduct } = useStore(
		useShallow((state) => ({
			storeProducts: state.products,
			addProduct: state.addProduct,
		})),
	)

	return (
		<>
			<main className='space-y-2 dark h-screen bg-background max-w-sm mx-auto mt-2'>
				<div className='flex justify-between items-center mx-2'>
					<User />
					<Cart />
				</div>
				<p className='text-2xl text-white'>Product:</p>
				<div className='space-y-2'>
					{PRODUCTS_DATA.map((product) => (
						<Card key={product.id}>
							<CardHeader>{product.title}</CardHeader>
							<CardContent>{product.price}$</CardContent>
							<CardFooter>
								{storeProducts.find((storeProduct) => storeProduct.id === product.id) ? (
									<ChangeQtyButtons key={product.id} productId={product.id} />
								) : (
									<Button onClick={() => addProduct(product)} variant='default'>
										Add to Cart
									</Button>
								)}
							</CardFooter>
						</Card>
					))}
				</div>
			</main>
		</>
	)
}

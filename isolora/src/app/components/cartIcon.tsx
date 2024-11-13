import Link from 'next/link';
import Image from "next/image";


const CartIcon = () => (
    <Link href="/cart">
       <Image src="/cart-icon.png" alt="Cart" width={20} height={20} />


    </Link>
);

export default CartIcon;

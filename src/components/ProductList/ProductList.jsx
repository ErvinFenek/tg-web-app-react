import React, {useCallback, useEffect, useState} from 'react';
import "./ProductList.css";
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";

const products = [
    {id: '1', title: 'Джинсы', price: 1000, description: 'S, blue'},
    {id: '2', title: 'Куртка', price: 2000, description: 'S, black'},
    {id: '3', title: 'Джинсы', price: 3000, description: 'M, blue'},
    {id: '4', title: 'Куртка', price: 4000, description: 'M, black'},
    {id: '5', title: 'Джинсы', price: 5000, description: 'L, blue'},
    {id: '6', title: 'Куртка', price: 6000, description: 'L, black'},
    {id: '7', title: 'Джинсы', price: 7000, description: 'Xl, blue'},
    {id: '8', title: 'Куртка', price: 8000, description: 'Xl, black'},
]

const getTotalPrice = (items) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)

}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://localhost:8000', {
            method: "POST",
            headers: {
                'Content-type': 'aplication/json',
            },
            body: JSON.stringify(data)
        })
    }, [])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData]);

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id)
        } else {
            newItems = [...addedItems, product]
        }

        setAddedItems(newItems);

        if (newItems.length === 0 ) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить товаров на ${getTotalPrice(newItems)}`
            })
        }
    }
    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
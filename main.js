console.log("Let's get shopping!");

// EMPTY CART ON INNIT //
const cart = {  
};

// PRODUCTS ARRAY //
const products = [
    { 
        code: "FR1",
        name: "Fruit_tea",
        price: 3.11,
        BOGOF: true,
        bulk: {
            bulk_trigger: null,
            discount_price: null
        }
    },
    { 
        code: "SR1",
        name: "Strawberries",
        price: 5.00,
        BOGOF: false,
        bulk: {
            bulk_trigger: 3,
            discount_price: 4.50
        }
    },
    {
        code: "CF1",
        name: "Coffee",
        price: 11.23,
        BOGOF: false,
        bulk: {
            bulk_trigger: null,
            discount_price: null
        }
    }
];

// FACTORY FUNCTION FOR CREATING NEW PRODUCTS //

const Product = (code, name, price, BOGOF, {bulk_trigger, discount_price}) => {

    return {
        code,
        name,
        price,
        BOGOF,
        bulk: {
            bulk_trigger,
            discount_price
        }
    }
}

// CONTROLLER AND UI //

let actionPrompt = prompt("ENTER [code], 'tally', 'add' (item) or 'quit'")
    .toUpperCase();

while (actionPrompt != "QUIT") {
    // .filter array out is always truthy.
    // Therefore length test ensures item.
    if (products.filter(product => product.code === actionPrompt).length > 0) {
        cart.hasOwnProperty(actionPrompt) ? 
            cart[actionPrompt] +=1 :
            cart[actionPrompt] = 1;
        console.table(cart);
        pickAction();
    } else {
        if (actionPrompt === "TALLY") {
            tallyCart();
            break;
        } else {
            if (actionPrompt == "ADD") {
                console.log("Adding item");
                addProductItem();
                pickAction();
            } else {
                alert("Product or command not recognised");
                pickAction();
            }
        }
    }
}

function pickAction() {
    return actionPrompt = prompt("ENTER [code], 'tally', 'add' (item) or 'quit'")
    .toUpperCase();
}

function addProductItem() {
    const itemCode = prompt("ENTER [code]")
    .toUpperCase();
    const itemName = prompt("ENTER [name]")
    .toLowerCase();
    const itemPrice = parseInt(prompt("ENTER [price]"));
    const itemBOGOF= prompt("ENTER [BOGOF]", "true or false")
    .toLowerCase();
    const itemBulkTrig = prompt("ENTER [bulk trigger]", "null or quantity");
    const itemBulkPrice = prompt("ENTER [bulk price]", "null or price");
    
    const newProduct = Product(
        itemCode,
        itemName,
        itemPrice,
        itemBOGOF,
        {bulk_trigger: itemBulkTrig, discount_price: itemBulkPrice}
    )
    products.push(newProduct);
    console.log(products);
}

function tallyCart() {
    alert("Adding items");
    let totalAllItems = 0;
    console.log(cart);
    for (const item in cart) {
        const itemRecord = products.filter(product =>
            product.code === item)[0];
        if (itemRecord.BOGOF) {
            console.log(`${itemRecord.name} is BOGOF!`);
            if (cart[item] % 2 !=0) {
                cart[item] +=1;
            }
            const totalBOGOF = BOGOFCalc({quantity: cart[item], price: itemRecord.price});
            totalAllItems += totalBOGOF;
            console.log(`${totalBOGOF} (${cart[item]})`);
        } else {
            if (itemRecord.bulk.bulk_trigger != null && cart[item] >= 
                    itemRecord.bulk.bulk_trigger) {
                console.log(`${itemRecord.name} get a discount!`);
                const totalbulk = bulkCalc({quantity: cart[item],
                    price: itemRecord.bulk.discount_price});
                totalAllItems += totalbulk;
                console.log(`${totalbulk} (${cart[item]})`);
            } else {
                console.log(`${itemRecord.name} at regular price.`);
                const totalRegularPrice = cart[item] * 
                    itemRecord.price;
                totalAllItems += totalRegularPrice;
                console.log(`${totalRegularPrice} (${cart[item]})`);
            }
        }
    }
    console.log(`Total: ${totalAllItems}`);
}

function BOGOFCalc ({quantity, price}) {
    return quantity * price / 2;
}

function bulkCalc({quantity, price}) {
    return quantity * price;

};

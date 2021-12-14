const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

function dataIdMatch(req, next) {
    let { data: { id }, } = req.body;
    const dishId = req.params.dishId;
    if (
        req.body.data.id === null ||
        req.body.data.id === undefined ||
        req.body.data.id === ""
    ) {
        return next();
    } if (req.body.data.id !== dishId) {
        next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
        });
    } else {
        next();
    }
}

function dishExists(req, res, next) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        next();
    } else {
        next({
            status: 404,
            message: `Dish ${dishId} does not exist`
        });
    }
}

function nameExists(req, res, next) {
    const { data: { name } = {} } = req.body;
    if (name) {
        res.locals.name = name;
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a name"
    });
    next();
}

function isNameValid(req, next) {
    if (
        req.body.data.name === '' ||
        req.body.data.name === null ||
        req.body.data.name === undefined
    ) {
        next({
            status: 400,
            message: "Dish must include a name"
        });
    } next();
}

function descriptionExists(req, res, next) {
    const { data: { description } = {} } = req.body;
    if (description) {
        res.locals.description = description;
        return next()
    } next({
        status: 400,
        message: "Dish must include a description."
    })

}

function isDescriptionValid(req, next) {
    if (
        req.body.data.description === null ||
        req.body.data.description === "" ||
        req.body.data.description === undefined
    ) {
        next({ status: 400, message: "Dish must include a description." });
    }
    next();
}

function priceExists(req, res, next) {
    const { data: { price } = {} } = req.body;
    if (price) {
        res.locals.price = price;
        return next()
    } next({
        status: 400,
        message: "Dish must include a price."
    })
}

function isPriceValid(req, next) {
    if (
        req.body.data.price === null ||
        req.body.data.price === "" ||
        req.body.data.price === undefined
    ) {
        next({
            status: 400,
            message: "Dish must include a price."
        });
    }
    if (typeof req.body.data.price === "number" && req.body.data.price > 0) {
        return next();
    } else {
        next({
            status: 400,
            message: "The price must be a number greater than 0."
        })
    }
}

function imageUrlExists(req, res, next) {
    const { data: { image_url } = {} } = req.body;
    if (image_url) {
        res.locals.imageUrl = image_url;
        return next();
    } next({
        status: 400,
        message: "Dish must include a image_url."
    })
}

function isImageUrlValid(req, next) {
    if (
        req.body.data.image_url === null ||
        req.body.data.image_url === undefined ||
        req.body.data.image_url === ""
    ) {
        next({ status: 400, message: "Dish must include an image_url." });
    }
    next();
}

function read(res) {
    res.json({ data: res.locals.dish });
}

function list(res) {
    res.json({ data: dishes });
}

function update(req, res) {
    const dish = res.locals.dish;
    const { data: { name, description, price, image_url } = {} } = req.body;
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
    res.json({ data: dish });
}

function create(req, res) {
    const { data: { image_url } = {} } = req.body;
    const newId = new nextId();
    const newDish = {
        id: newId,
        name: res.locals.name,
        description: res.locals.description,
        price: res.locals.price,
        image_url: image_url
    }
    dishes.push(newDish);
    res.status(201).send({ data: newDish });
}

module.exports = {
    list,
    read: [dishExists, read],
    create: [
        nameExists,
        isNameValid,
        descriptionExists,
        isDescriptionValid,
        priceExists,
        isPriceValid,
        imageUrlExists,
        isImageUrlValid,
        create
    ], update: [
        dishExists,
        dataIdMatch,
        nameExists,
        isNameValid,
        descriptionExists,
        isDescriptionValid,
        priceExists,
        isPriceValid,
        imageUrlExists,
        isImageUrlValid,
        update
    ],

}
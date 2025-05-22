---
title: Getting Started
---

# Esix is a slick ORM for MongoDB.

Inspired by ActiveRecord and Eloquent, Esix is a great way to work with your
database in TypeScript. 🥧

Esix uses a
[Convention over Configuration](https://en.wikipedia.org/wiki/Convention_over_configuration)
approach where you define your models as normal TypeScript classes and with
minimal boilerplate.

## Install Esix

Add the package using your favorite package manager.

**Yarn**

```sh
yarn add esix mongodb
```

**NPM**

```sh
npm install esix mongodb
```

## Getting Started

First off, you'll need to define your model.

```ts
import { baseModel } from 'esix'

export default class Book extends BaseModel {
  public isbn = ''
  public title = ''
}
```

The base model comes with id and timestamp fields so you don't have to worry
about those things.

Now you are ready to create some data!

```ts
import Book from './book'

async function createBooks(): Promise<void> {
  await Book.create({
    isbn: '978-0525536291',
    title: 'The Vanishing Half'
  })
  await Book.create({
    isbn: '978-0525521143',
    title: 'The Glass Hotel'
  })
}
```

Then you can easily query your models.

```ts
import { Request, Response } from 'express'
import Book from './book'

async function showBook(request: Request, response: Response): Promise<void> {
  const book = await Book.find(request.params.id)

  response.json({
    book
  })
}
```

---

# Defining Models

Esix provides a beautiful, simple ActiveRecord implementation for working with
your database. Each collection has a corresponding "Model" which is used to
interact with that collection. Models allow you to query for data in your
tables, as well as insert new documents into the collection.

Models are the entry point for working with data in Esix so let's create our
first model.

```ts
import { BaseModel } from 'esix'

class BlogPost extends BaseModel {
  public title = ''
  public publishedAt = 0
}
```

By defining a model and extending the `BaseModel` class, you get access to all
of Esix's functionality and you can use it to
[Create, Update](/inserting-and-updating-models) and [Query](/retrieving-models)
documents from the database.

The model will already have `id` property which will be defaulted to an
[ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/) unless
you provide one yourself.

It also comes with two timestamp properties, `createdAt` and `updatedAt` which
will be updated during the model's lifecycle. When a model is created, the
`createdAt` property will be populated with the current timestamp, and every
time you update or save your model, the `updatedAt` property will have the
current timestamp.

Both values contain the current time in milliseconds since January 1st, 1970,
using JavaScript's
[Date.now](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
function.

The collection the models act upon is determined by name of the class. The class
name is transformed into a dasherized and pluralized version and this is used
for all operations against the database.

For example, if you have a class named `BlogPost`, the collection name will be
`blog-posts`. This is due to Esix's strong belief in
[Convention over Configuration](https://en.wikipedia.org/wiki/Convention_over_configuration).

---

# Inserting & Updating Models

When it comes to adding new models to the database, there are two different ways
to go about it. You can either use the `create` method and pass it the
attributes you want the model to have, or you can create a new instance of the
model and call it's `save` method.

```ts
// Using the create method.
const firstPost = await BlogPost.create({ title: 'My First Blog Post!' })

// Using the save method.
const secondPost = new BlogPost()

secondPost.title = 'My Second Blog Post!'

await secondPost.save()
```

If the model doesn't have an Id, a new
[ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/) will be
created and assigned to it.

When inserting a new model, the `createdAt` property will be filled with the
current timestamp if it's not present.

If you want to update an existing model, you can also use the `save` method to
persist your changes.

```ts
const product = await Product.find('5f5a474b32fa462a5724ff7d')

product.price = 14.99

await product.save()
```

When you call `save` on an already existing model, the `updatedAt` field will be
filled with the current timestamp.

Both the timestamp properties contain the current time in milliseconds since
January 1st, 1970, using JavaScript's
[Date.now](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
method.

---

# Retrieving Models

Once you have your models defined, you can use them to query the database for
them. You can think of each Eloquent model as a powerful
[query builder](/api/classes/querybuilder.html) allowing you to fluently query
the documents associated with the model.

If you are looking for a single model you can use the `find` method to get an
instance of a model matching the given id.

```ts
const book = await Book.find(22)

console.log(book.title)
```

You can also get all the models in the collection.

```ts
const flights = await Flight.all()

flights.forEach((flight) => {
  console.log(flight.name)
})
```

When you are working with multiple models, you can use methods like `where`
which returns an instance of a `QueryBuilder`. The Query Builder can be used to
filter, sort, and limit your searches.

```ts
const blogPosts = await BlogPost.where('status', 'published')
  .where('categoryId', 4)
  .orderBy('publishedAt', 'desc')
  .limit(12)
  .get()

blogPosts.forEach((post) => console.log(post.title))
```

You can use `whereIn` to retrieve models where a column's value is within a
given array:

```ts
const users = await User.whereIn('id', [1, 2, 3]).get()
```

Conversely, you can use `whereNotIn` to retrieve models where a column's value
is not within a given array:

```ts
const users = await User.whereNotIn('id', [1, 2, 3]).get()
```

If you are only interested in a single attribute of a model, you can use the
`pluck` method to get an array of values for that attribute.

```ts
const productNames = await Product.where('category', 'lamps').pluck('name')

productNames.forEach((name) => console.log(name))
```

You can find out more about the different methods available by consulting the
API documentation for [BaseModel](/api/classes/basemodel.html) and
[QueryBuilder](/api/classes/querybuilder.html).

## Aggregate Functions

Once you are happy with your query, you can use the aggregate functions
available in Esix to perform calculations on the data set. The supported
aggregates are `average`, `count`, `max`, `min`, `percentile`, and `sum`.

```ts
await Product.where('category', 'lamps').average('price')

await Product.where('category', 'lamps').count()

await Product.where('category', 'lamps').max('price')

await Product.where('category', 'lamps').min('price')

await Product.where('category', 'lamps').percentile('price', 50)

await Product.where('category', 'lamps').sum('price')
```

---

# Deleting Models

Once your data is no longer needed, Esix provides two ways of removing models
from the database. You can either use an instance of a model to delete that
model or you can create a query to remove multiple models.

## Deleting a Single Model

If you have a single model you want to delete, you can use the `delete` method
on the instance.

Keep in mind that the data is instantly removed and won't be recoverable.

```ts
const post = await BlogPost.find('5f5a4c36493d53b6caa8410e')

await post.delete()
```

## Deleting Multiple Models

If you want to remove models in bulk, you can use the normal methods available
on the QueryBuilder to create a matching selection.

```ts
await Jobs.where('completed', true).limit(12).delete()
```

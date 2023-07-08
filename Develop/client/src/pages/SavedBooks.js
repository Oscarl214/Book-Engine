import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

import { getMe, deleteBook } from "../utils/API";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || {};

  const [removeBook, { error }] = useMutation(
    REMOVE_BOOK
    // , {
    // update(cache, { data: { removeBook } }) {
    //   try {
    //     // Reads the user's data from the cache
    //     const { me } = cache.readQuery({ query: QUERY_ME });

    //     // Updates the user's savedBooks array by filtering out the removed book
    //     const updatedSavedBooks = me.savedBooks.filter(
    //       (book) => book._id !== removeBook._id
    //     );

    //     // Write the updated user data back to the cache
    //     cache.writeQuery({
    //       query: QUERY_ME,
    //       data: { me: { ...me, savedBooks: updatedSavedBooks } },
    //     });
    //   } catch (e) {
    //     console.error(e);
    //   }
    // },
  );

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      const { data } = await removeBook({ variables: { bookId } });
      //deconstructed the bookId property
      removeBookId(bookId);

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing {userData.username}'s saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WordleGame from "./Wordle";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

describe("WordleGame Component", () => {
  const randomGameId = 1;
  const mockWord = "apple";

  beforeEach(() => {
    mock.reset();
    mock.onGet(`http://127.0.0.1:8000/api/games/${randomGameId}/`).reply(200, { word: mockWord });

    mock.onPost(`http://127.0.0.1:8000/api/games/${randomGameId}/make_guess/`).reply(200, {
      feedback: "GBGBG",
    });
  });

  test("should fetch the word and render the input field", async () => {
    render(<WordleGame />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Guess Word")).toBeInTheDocument();
    });
  });
  

  test.only("should allow the user to enter a guess", async () => {
    render(<WordleGame />);

    await waitFor(() => screen.getByPlaceholderText("Guess Word"));

    const inputField = screen.getByPlaceholderText("Guess Word");
    fireEvent.change(inputField, { target: { value: "apple" } });

    expect(inputField.value).toBe("apple");
  });

  test("should submit the guess and show feedback", async () => {
    render(<WordleGame />);

    await waitFor(() => screen.getByPlaceholderText("Guess Word"));

    const inputField = screen.getByPlaceholderText("Guess Word");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(inputField, { target: { value: "apple" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText("GBGBG")).toBeInTheDocument());
  });

  test("should display the correct colored boxes based on feedback", async () => {
    render(<WordleGame />);

    await waitFor(() => screen.getByPlaceholderText("Guess Word"));

    const inputField = screen.getByPlaceholderText("Guess Word");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(inputField, { target: { value: "apple" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const boxes = screen.getAllByClassName("box-color");
      expect(boxes.length).toBe(mockWord.length);

      expect(boxes[0].style.backgroundColor).toBe("rgb(0, 128, 0)");
      expect(boxes[1].style.backgroundColor).toBe("rgb(255, 255, 0)");
      expect(boxes[2].style.backgroundColor).toBe("rgb(255, 0, 0)");
    });
  });

  test("should display 'You Won!' when the game is over", async () => {
    mock.onPost(`http://127.0.0.1:8000/api/games/${randomGameId}/make_guess/`).reply(200, {
      feedback: "GGGGG",
    });

    render(<WordleGame />);

    await waitFor(() => screen.getByPlaceholderText("Guess Word"));

    const inputField = screen.getByPlaceholderText("Guess Word");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(inputField, { target: { value: "apple" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText("You Won!")).toBeInTheDocument());
  });

  test("should disable input and button when the game is over", async () => {
    mock.onPost(`http://127.0.0.1:8000/api/games/${randomGameId}/make_guess/`).reply(200, {
      feedback: "GGGGG",
    });

    render(<WordleGame />);

    await waitFor(() => screen.getByPlaceholderText("Guess Word"));

    const inputField = screen.getByPlaceholderText("Guess Word");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(inputField, { target: { value: "apple" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText("You Won!")).toBeInTheDocument());
    expect(inputField).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});

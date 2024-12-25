import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(500);
  const [currentAlgorithm, setCurrentAlgorithm] = useState("Bubble Sort");
  const [isSorting, setIsSorting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const sortingAnimations = useRef([]);
  const currentStep = useRef(0);
  const intervalId = useRef(null);

  useEffect(() => {
    generateNewArray();
  }, [arraySize]);

  const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  const generateNewArray = () => {
    const newArray = Array.from({ length: arraySize }, () =>
      randomNumber(100, 500)
    );
    setArray(newArray);
    sortingAnimations.current = [];
    currentStep.current = 0;
    resetColors();
  };

  const resetColors = () => {
    document.querySelectorAll(".bar").forEach((bar) => {
      bar.style.backgroundColor = "whitesmoke";
    });
  };

  const disableControls = () => setIsSorting(true);
  const enableControls = () => setIsSorting(false);

  const anim = (index, height, color) => {
    sortingAnimations.current.push({ index, height, color });
  };

  const bubbleSort = () => {
    const arrayCopy = [...array];
    for (let i = 0; i < arrayCopy.length - 1; i++) {
      for (let j = 0; j < arrayCopy.length - i - 1; j++) {
        anim(j, arrayCopy[j], "red");
        anim(j + 1, arrayCopy[j + 1], "yellow");
        if (arrayCopy[j] > arrayCopy[j + 1]) {
          [arrayCopy[j], arrayCopy[j + 1]] = [arrayCopy[j + 1], arrayCopy[j]];
          anim(j, arrayCopy[j], "yellow");
          anim(j + 1, arrayCopy[j + 1], "red");
        }
        anim(j, arrayCopy[j], "whitesmoke");
        anim(j + 1, arrayCopy[j], "whitesmoke");
      }
      anim(
        arrayCopy.length - 1 - i,
        arrayCopy[arrayCopy.length - 1 - i],
        "green"
      );
    }
    anim(0, arrayCopy[0], "green");
  };

  const insertionSort = () => {
    const arrayCopy = [...array];
    for (let i = 1; i < arrayCopy.length; i++) {
      let j = i - 1;
      let key = arrayCopy[i];
      anim(i, key, "red"); // Highlight the key being compared

      while (j >= 0 && arrayCopy[j] > key) {
        anim(j, arrayCopy[j], "yellow"); // Highlight the element being shifted
        arrayCopy[j + 1] = arrayCopy[j]; // Shift the element
        anim(j + 1, arrayCopy[j], "red"); // Highlight the position after shift
        anim(j, arrayCopy[j], "whitesmoke"); // Reset the previous bar
        j--;
      }

      arrayCopy[j + 1] = key; // Place the key in its correct position
      anim(j + 1, key, "green"); // Mark the sorted position in green
    }

    // Mark all elements green after sorting is done
    for (let i = 0; i < arrayCopy.length; i++) {
      anim(i, arrayCopy[i], "green");
    }
  };

  const selectionSort = () => {
    const arrayCopy = [...array];
    for (let i = 0; i < arrayCopy.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arrayCopy.length; j++) {
        anim(j, arrayCopy[j], "yellow");
        if (arrayCopy[j] < arrayCopy[minIndex]) {
          anim(minIndex, arrayCopy[minIndex], "whitesmoke");
          minIndex = j;
        } else {
          anim(j, arrayCopy[j], "whitesmoke");
        }
      }
      [arrayCopy[i], arrayCopy[minIndex]] = [arrayCopy[minIndex], arrayCopy[i]];
      anim(i, arrayCopy[i], "green");
      anim(minIndex, arrayCopy[minIndex], "green");
    }
  };

  const mergeSort = () => {
    const merge = (arr, l, m, r) => {
      let n1 = m - l + 1;
      let n2 = r - m;

      let L = new Array(n1);
      let R = new Array(n2);

      for (let i = 0; i < n1; i++) L[i] = arr[l + i];
      for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

      let i = 0;
      let j = 0;
      let k = l;

      while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          anim(k, arr[k], "red");
          i++;
        } else {
          arr[k] = R[j];
          anim(k, arr[k], "yellow");
          j++;
        }
        anim(k, arr[k], "whitesmoke");
        k++;
      }

      while (i < n1) {
        arr[k] = L[i];
        anim(k, arr[k], "red");
        i++;
        k++;
      }

      while (j < n2) {
        arr[k] = R[j];
        anim(k, arr[k], "yellow");
        j++;
        k++;
      }
    };

    const mergeSortHelper = (arr, l, r) => {
      if (l >= r) return;
      const m = l + Math.floor((r - l) / 2);
      mergeSortHelper(arr, l, m);
      mergeSortHelper(arr, m + 1, r);
      merge(arr, l, m, r);
    };

    const arrayCopy = [...array];
    mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1);

    // Mark all elements green after sorting is done
    for (let k = 0; k < arrayCopy.length; k++) {
      anim(k, arrayCopy[k], "green");
    }

    playSorting();
  };

  const quickSort = () => {
    const partition = (arr, low, high) => {
      let pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          anim(i, arr[i], "yellow");
          anim(j, arr[j], "red");
        } else {
          anim(j, arr[j], "whitesmoke");
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      anim(i + 1, arr[i + 1], "green");
      anim(high, arr[high], "green");

      return i + 1;
    };

    const quickSortHelper = (arr, low, high) => {
      if (low < high) {
        let pi = partition(arr, low, high);
        quickSortHelper(arr, low, pi - 1);
        quickSortHelper(arr, pi + 1, high);
      } else if (low === high) {
        // Single element case
        anim(low, arr[low], "green");
      }
    };

    const arrayCopy = [...array];
    quickSortHelper(arrayCopy, 0, arrayCopy.length - 1);

    // Mark all elements green after sorting is done
    for (let k = 0; k < arrayCopy.length; k++) {
      if (
        sortingAnimations.current.length === 0 ||
        sortingAnimations.current.every((animation) => animation.index !== k)
      ) {
        anim(k, arrayCopy[k], "green");
      }
    }
  };

  const handleSort = () => {
    switch (currentAlgorithm) {
      case "Bubble Sort":
        bubbleSort();
        break;
      case "Insertion Sort":
        insertionSort();
        break;
      case "Selection Sort":
        selectionSort();
        break;
      case "Merge Sort":
        mergeSort();
        break;
      case "Quick Sort":
        quickSort();
        break;
      default:
        bubbleSort();
    }
    playSorting();
  };

  const playSorting = () => {
    if (intervalId.current) return;
    disableControls();
    intervalId.current = setInterval(() => {
      if (currentStep.current >= sortingAnimations.current.length) {
        clearInterval(intervalId.current);
        intervalId.current = null;
        if (currentStep.current >= sortingAnimations.current.length)
          enableControls();
        return;
      }
      const { index, height, color } =
        sortingAnimations.current[currentStep.current];
      setArray((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = height;
        return newArray;
      });
      document.getElementsByClassName("bar")[index].style.backgroundColor =
        color;
      currentStep.current += 1;
    }, 1000 / speed);
  };

  const handleReset = () => {
    clearInterval(intervalId.current);
    intervalId.current = null;
    enableControls();
    generateNewArray();
  };

  const handleAlgorithmSelect = (algorithm) => {
    setCurrentAlgorithm(algorithm);
    setShowDropdown(false);
  };

  return (
    <div className="App">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">Sorting Visualizer</div>
          <div className="flex items-center space-x-4">
            <button
              onClick={generateNewArray}
              className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
            >
              Generate New Array
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
              >
                {currentAlgorithm}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <button
                    onClick={() => handleAlgorithmSelect("Bubble Sort")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Bubble Sort
                  </button>
                  <button
                    onClick={() => handleAlgorithmSelect("Insertion Sort")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Insertion Sort
                  </button>
                  <button
                    onClick={() => handleAlgorithmSelect("Selection Sort")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Selection Sort
                  </button>
                  <button
                    onClick={() => handleAlgorithmSelect("Merge Sort")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Merge Sort
                  </button>
                  <button
                    onClick={() => handleAlgorithmSelect("Quick Sort")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Quick Sort
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-white">Array Size</label>
              <input
                type="range"
                min="10"
                max="100"
                value={arraySize}
                onChange={(e) => setArraySize(e.target.value)}
                className="slider"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-white">Speed</label>
              <input
                type="range"
                min="1"
                max="50"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="slider"
              />
            </div>
          </div>
        </div>
      </nav>
      <div className="bars-container mt-8 flex justify-center items-end">
        {array.map((value, index) => (
          <div
            className="bar"
            key={index}
            style={{
              height: `${value}px`,
              width: arraySize > 30 ? "20px" : "30px",
              backgroundColor: "whitesmoke",
            }}
          ></div>
        ))}
      </div>
      <div className="buttons-container mt-8 flex justify-center space-x-4">
        <button
          onClick={handleSort}
          disabled={isSorting}
          className={`text-white px-6 py-3 rounded ${
            isSorting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-400"
          }`}
        >
          Sort
        </button>
        <button
          onClick={handleReset}
          className="text-white px-6 py-3 rounded bg-red-500 hover:bg-red-400"
        >
          Reset
        </button>
      </div>
      <div className="legend-container mt-4 text-center">
        <div className="flex justify-center space-x-4">
          <div className="legend-item flex items-center">
            <div className="legend-color bg-red-500 rounded-full w-4 h-4"></div>
            <div className="legend-text text-red-700 ml-2">Comparing</div>
          </div>
          <div className="legend-item flex items-center">
            <div className="legend-color bg-yellow-500 rounded-full w-4 h-4"></div>
            <div className="legend-text text-yellow-500 ml-2">
              Swapping/Selecting
            </div>
          </div>
          <div className="legend-item flex items-center">
            <div className="legend-color bg-green-500 rounded-full w-4 h-4"></div>
            <div className="legend-text text-green-800 ml-2">Sorted</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

import axios from "axios";
import { useState, useEffect } from "react";
import { IconButton, Snackbar } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

export function Homepage() {
  const [searchTourist, setSearchTourist] = useState("");
  const [touristData, setTouristData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getTouristData();
  }, []);

  useEffect(() => {
    searchTouristText(searchTourist);
  }, [searchTourist]);

  const getTouristData = async () => {
    try {
      const response = await axios.get("http://localhost:4001/trips?keywords=");
      setTouristData(response.data.data);
    } catch (error) {
      alert(error);
    }
  };

  const searchTouristText = async (text) => {
    try {
      const request = await axios.get(
        `http://localhost:4001/trips?keywords=${text}`
      );
      setTouristData(request.data.data);
    } catch (error) {
      alert(error);
    }
  };

  const clickTagsSearch = (text) => {
    setSearchTourist((prevSearch) => {
      const separator = prevSearch.trim() !== "" ? " " : "";
      return prevSearch + separator + text;
    });
    searchTouristText(searchTourist);
  };

  const handleClick = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setOpen(true);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div
      className="flex flex-col w-screen h-screen pt-24 gap-16 items-center"
      style={{ fontFamily: "Kanit, sans-serif" }}
    >
      <h1 className="text-6xl text-center text-cyan-600">เที่ยวไหนดี</h1>
      <div className="flex flex-col w-10/12 pl-20">
        <p className="text-xl">ค้นหาที่เที่ยว</p>
        <input 
          type="text"
          placeholder="หาที่เที่ยวแล้วไปกัน ..."
          value={searchTourist}
          className="w-10/12 h-12 text-xl text-center border-4 border-transparent border-b-gray-300"
          onChange={(e) => {
            setSearchTourist(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-20 w-10/12">
        {touristData.map((items) => {
          return (
            <div className="flex gap-10" key={items.eid}>
              <div className="flex w-4/12 justify-end">
                <img
                  src={items.photos[0]}
                  alt={items.title}
                  className="w-[650px] rounded-3xl"
                />
              </div>
              <div className="flex flex-col w-8/12 gap-2">
                <h1 className="text-4xl">{items.title}</h1>
                {items.description.length > 100 ? (
                  <>
                    <p className="text-xl text-gray-500">
                      {items.description.slice(0, 100)}
                      <span className="text-cyan-600">...</span>
                    </p>
                    <a
                      href={items.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 text-xl underline decoration-1"
                    >
                      อ่านต่อ
                    </a>
                  </>
                ) : (
                  <p>{items.description}</p>
                )}
                <div className="text-xl text-gray-500">
                  {items.tags.map((item, index) => (
                    <>
                      {index === 0 ? (
                        <>
                          หมวด{" "}
                          <span
                            key={index}
                            onClick={() => clickTagsSearch(item)}
                            style={{ cursor: "pointer", marginRight: "8px" }}
                            className="underline decoration-1"
                          >
                            {item}
                          </span>
                        </>
                      ) : index === items.tags.length - 1 ? (
                        <>
                          {" "}
                          และ{" "}
                          <span
                            key={index}
                            onClick={() => clickTagsSearch(item)}
                            style={{ cursor: "pointer", marginRight: "8px" }}
                            className="underline decoration-1"
                          >
                            {item}
                          </span>
                        </>
                      ) : (
                        <>
                          {" "}
                          <span
                            key={index}
                            onClick={() => clickTagsSearch(item)}
                            style={{ cursor: "pointer", marginRight: "8px" }}
                            className="underline decoration-1"
                          >
                            {item}
                          </span>
                        </>
                      )}
                    </>
                  ))}
                </div>
                <div className="flex flex-row gap-20">
                  <div className="flex gap-16">
                    {items.photos.map((item, index) =>
                      index === 0 ? null : (
                        <img
                          key={index}
                          src={item}
                          className="w-[170px] h-[150px] rounded-3xl"
                        />
                      )
                    )}
                  </div>
                  <IconButton
                    onClick={(e) => handleClick(items.url)}
                    color="primary"
                  >
                    <ShareIcon />
                  </IconButton>
                  <Snackbar
                    message="Copied to clibboard"
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    autoHideDuration={20000}
                    onClose={() => setOpen(false)}
                    open={open}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

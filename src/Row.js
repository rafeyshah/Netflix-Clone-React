import React, { useEffect, useState } from 'react'
import axios from "./axios";
import "./Row.css";
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
const baseUrl = "https://image.tmdb.org/t/p/original/";

function Row({title,fetchURL,isLargeRow}) {
    const [movies,setMovies]= useState([]);
    
    const [trailerUrl, setTrailerUrl] = useState("");

// component mounts

// react-youtube opts
const opts = {
    height:"390",
    width:"100%",
    playerVars:{
        autoplay:1, 
    }
}

// user click on pic

const handleClick =(movie)=>{
    console.log(movie);
    if(trailerUrl){
        setTrailerUrl("");
    }else{
        movieTrailer(movie?.name || movie?.original_name || movie?.title || movie?.original_title ||  "")
        .then(url =>{
            const urlParams = new URLSearchParams( new URL(url).search);
             setTrailerUrl(urlParams.get('v'))
        })
        .catch( error=> alert("Try other line because they are being uploaded"))
    }
}
    
    useEffect(() => {
    
        async function fetchData(){
            const request = await axios.get(fetchURL);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchURL])

    return (
        <div className="row">

            <h2>{title}</h2>
            <div className="row__posters">
                {
                    movies.map(movie => {
                        return <img 
                        key={movie.id} 
                        onClick={()=> handleClick(movie)}
                        
                         src={`${baseUrl}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                         alt={movie.name} className={`row__poster ${isLargeRow && "row__posterLarge"}`} />
                    })
                }
            </div>
            { 
                trailerUrl &&
                <YouTube videoId={trailerUrl} opts={opts}/>
                }
        </div>
    )
}

export default Row

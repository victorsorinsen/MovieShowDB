import React from 'react';
import { FaStar } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import Background from './background';
import { useParams } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';

const PersonDescription = () => {
  const { id } = useParams();
  const [personDetails, setPersonDetails] = useState([]);
  const [personCreditsCast, setPersonCreditsCast] = useState([]);
  const [personCreditsCrew, setPersonCreditsCrew] = useState([]);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${id}?api_key=6a77f5a2cdf1a150f808f73c35533a92&append_to_response=combined_credits&language=en-US`
        );
        const data = await response.json();

        setPersonDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    const getPersonCredits = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US&api_key=6a77f5a2cdf1a150f808f73c35533a92`
        );
        const data = await response.json();
        const crew = data.crew.map((crew, index) => {
          return {
            movieTitle: crew.title,
            moviePoster:
              'https://www.themoviedb.org/t/p/original' + crew.poster_path,

            movieId: crew.id,
            movieName: crew.name,
            movieRole: crew.job,
            mediaType: crew.media_type,
            movieDate: crew.release_date,
            movieAirDate: crew.first_air_date,
            vote_average: parseFloat(crew.vote_average.toFixed(1)),
          };
        });
        const cast = data.cast.map((cast, index) => {
          return {
            movieTitle: cast.title,
            moviePoster:
              'https://www.themoviedb.org/t/p/original' + cast.poster_path,

            movieId: cast.id,
            movieName: cast.name,
            movieRole: cast.job,
            mediaType: cast.media_type,
            movieDate: cast.release_date || cast.first_air_date || 'Upcoming',
            movieChar: cast.character,
            vote_average: parseFloat(cast.vote_average.toFixed(1)),
          };
        });
        setPersonCreditsCast(cast);
        setPersonCreditsCrew(crew);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    getPersonCredits();
    fetchPersonDetails();
  }, [id]);

  const {
    biography,
    birthday,
    deathday,
    gender,
    known_for_department,
    name,
    profile_path,
    place_of_birth,
    combined_credits,
  } = personDetails;

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 0:
        return 'Not specified';
      case 1:
        return 'Female';
      case 2:
        return 'Male';
      case 3:
        return 'Non-binary';
      default:
        return 'Unknown';
    }
  };

  const genderLabel = getGenderLabel(gender);

  const sortedCast = personCreditsCast.slice().sort((a, b) => {
    return b.movieDate.localeCompare(a.movieDate);
  });

  const sortedCrew = personCreditsCrew.slice().sort((a, b) => {
    const dateA = a.movieDate ? new Date(a.movieDate) : new Date();
    const dateB = b.movieDate ? new Date(b.movieDate) : new Date();
    return dateB - dateA;
  });

  const crewTabs = [
    ...new Set(personCreditsCrew.map((item) => item.movieRole)),
  ];

  const crewTabsData = {};
  sortedCrew.forEach((item) => {
    if (!crewTabsData[item.movieRole]) {
      crewTabsData[item.movieRole] = [];
    }
    crewTabsData[item.movieRole].push(item);
  });

  return (
    <>
      {/* <Background /> */}
      <div className={`persondescriptionPage`}>
        <div className="persongeneralDescription">
          <div className="persondivImage">
            <img
              className="persondescrImage"
              src={`https://www.themoviedb.org/t/p/original${profile_path}`}
            />
          </div>
          <div className="persondivDescription">
            <div>
              <h1>{name}</h1>
            </div>
            <div>
              <h5>
                <b>Personal details:</b>
              </h5>
            </div>

            <div className="personmovieCast">
              <GoDotFill className="personmovieDots" />
              <div className="personmovieYear">
                Known For: {known_for_department}
              </div>
              {/* <GoDotFill className="personmovieDots" />
              <p>
                <b>
                  Also Known As:{' '}
                  {also_known_as && also_known_as.length > 0
                    ? also_known_as.join(', ')
                    : 'N/A'}
                </b>
              </p> */}
            </div>

            <div className="personmovieRatingYearRuntime">
              <GoDotFill className="personmovieDots" />
              <div className="personmovieYear">Gender: {genderLabel}</div>
            </div>
            <div></div>
            <div className="personmovieGenres">
              <GoDotFill className="personmovieDots" />
              <div className="personmovieRating">
                <span>
                  <b>Born: {birthday}</b>
                </span>
              </div>
              <GoDotFill className="personmovieDots" />
              <div className="personmovieYear">
                Place of birth: {place_of_birth}
              </div>
            </div>
            {deathday && (
              <div className="personmovieRuntime">
                {' '}
                <GoDotFill className="personmovieDots" />
                <p> Died: {deathday}</p>
              </div>
            )}
            <div className="personmovieOverview">
              <h6>Biography</h6>
              <p>{biography}</p>
            </div>
          </div>
        </div>
      </div>
      {/* ))} */}.
      <Tabs
        defaultActiveKey="Actor"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="Actor" title="Actor">
          {sortedCast.length > 0 && (
            <div className="creditsTabDiv">
              {sortedCast.map((item, index) => (
                <div className="creditItemDiv" key={index}>
                  <div className="creditImage">
                    {item.moviePoster.endsWith(null) ? (
                      <img
                        src="/src/assets/No-Image-Placeholder.png"
                        alt=""
                        className="searchImage"
                      />
                    ) : (
                      <img
                        src={item.moviePoster}
                        alt=""
                        className="searchImage"
                      />
                    )}
                  </div>
                  <div className="creditDetailsDiv">
                    <div className="titleDate">
                      {item.mediaType === 'movie' ? (
                        <Link to={`/movies/${item.movieId}`}>
                          <b>{item.movieTitle}</b>
                        </Link>
                      ) : (
                        <Link to={`/tv/${item.movieId}`}>
                          <b>{item.movieName}</b>
                        </Link>
                      )}
                    </div>
                    <p className="smallerText" key={index}>
                      <FaStar className="starrating" size={20} />
                      {item.vote_average}
                    </p>
                    <div>"{item.movieChar}"</div>
                  </div>
                  <div className="dateDisplay">{item.movieDate}</div>
                </div>
              ))}
            </div>
          )}
        </Tab>
        {crewTabs.map((tabItem, tabIndex) => (
          <Tab eventKey={tabItem} title={tabItem} key={tabItem + tabIndex}>
            {sortedCrew.length > 0 && (
              <div className="creditsTabDiv">
                {sortedCrew
                  .filter((item) => item.movieRole === tabItem)
                  .map((item, index) => (
                    <div className="creditItemDiv" key={index}>
                      <div className="creditImage">
                        {item.moviePoster.endsWith(null) ? (
                          <img
                            src="/src/assets/No-Image-Placeholder.png"
                            alt=""
                            className="searchImage"
                          />
                        ) : (
                          <img
                            src={item.moviePoster}
                            alt=""
                            className="searchImage"
                          />
                        )}
                      </div>
                      <div className="creditDetailsDiv">
                        <div className="titleDate">
                          {item.mediaType === 'movie' ? (
                            <Link to={`/movies/${item.movieId}`}>
                              <b>{item.movieTitle}</b>
                            </Link>
                          ) : (
                            <Link to={`/tv/${item.movieId}`}>
                              <b>{item.movieName}</b>
                            </Link>
                          )}
                        </div>
                        <p className="smallerText" key={index}>
                          <FaStar className="starrating" size={20} />
                          {item.vote_average}
                        </p>
                        <div>"{item.movieRole}"</div>
                      </div>
                      <div className="dateDisplay">
                        {item.movieDate || 'Upcoming'}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

export default PersonDescription;

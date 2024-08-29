import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";

const App = () => {
 mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

  const [error, setError] = useState(undefined);
  const [countryImg, setCountryImg] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [provider, setProvider] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    fetch("http://ip-api.com/json/?fields=61439")
      .then((res) => res.json())
      .then((data) => {
        const {
          status,
          country,
          countryCode,
          regionName,
          city,
          zip,
          lat,
          lon,
          isp,
          query,
        } = data;

        if (status === "success") {
          setCountry(country);
          setCountryImg(
            `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
          );
          setRegion(regionName);
          setCity(city);
          setZip(zip);
          setMapLink(`https://www.google.com/maps/@${lat},${lon},${zoom}z`);
          setProvider(isp);
          setIpAddress(query);
          if (map.current) return;
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lon, lat],
            zoom: zoom,
          });
        } else {
          setError("Error");
        }
      });
  }, [zoom]);

  const handleMapClick = () => {
    window.open(mapLink, "_blank");
  };

  return (
    <>
      {error ? (
        error
      ) : (
        <main>
          <div className="container">
            <h1>IP Address Finder</h1>

            <div className="ip-address-container">
              <h2>Your IP Address:</h2>
              <p className="ip-adress">{ipAddress}</p>
            </div>

            <div className="country-container">
              <h2>Country:</h2>
              <div>
                <p>{country}</p>
                <img src={countryImg} alt={`${country}-img`} />
              </div>
            </div>

            <div className="location-container">
              <h2>Approx Location:</h2>
              <p>
                {region}, {city}, {zip}
              </p>
            </div>

            <div className="provider-container">
              <h2>Internet Provider:</h2>
              <p>{provider}</p>
            </div>
          </div>

          <div>
            <p>Click to view on Google Maps ⤵️</p>
            <div
              ref={mapContainer}
              className="map-container"
              onClick={handleMapClick}
              style={{ cursor: "pointer" }}
            />
          </div>
        </main>
      )}
    </>
  );
};

export default App;

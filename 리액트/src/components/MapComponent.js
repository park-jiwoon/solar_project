import React, { useEffect } from 'react';

const MapComponent = ({ address }) => {
  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };

    const map = new window.kakao.maps.Map(container, options);

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, function(result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: coords
        });
        map.setCenter(coords);
      }
    });
  }, [address]);

  return <div id="map" style={{ width: '100%', height: '350px' }}></div>;
};

export default MapComponent;

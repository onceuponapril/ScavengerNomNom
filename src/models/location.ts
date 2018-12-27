export class Location {
  private description: string;
  private roomNumber: string;
  private latitude: number;
  private longitude: number;

  public constructor (description:string="", roomNumber: string="", latitude: number=null, longitude: number=null) {
    this.description = description;
    this.roomNumber = roomNumber;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  public setDescription(newDes: string):void {
    this.description = newDes;
  }

  public setRoomNumber(newRN: string):void {
    this.roomNumber = newRN;
  }

  public setLat(newLat: number):void {
    this.latitude = newLat;
  }

  public setLon(newLon: number):void {
    this.longitude = newLon;
  }

  public getDescription():string {
    return this.description;
  }

  public getRoomNumber():string {
    return this.roomNumber;
  }

  public getCoordinates(): object {
    return {lat: this.latitude, lon: this.longitude};
  }

  public isNew(): boolean {
    return this.description == "" && this.roomNumber == "" && this.latitude == null && this.longitude == null;
  }

  public calculateDistance(anotherLat: number, anotherLong: number): number{
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::                                                                         :::
    //:::  This routine calculates the distance between two points (given the     :::
    //:::  latitude/longitude of those points). It is being used to calculate     :::
    //:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
    //:::                                                                         :::
    //:::  Definitions:                                                           :::
    //:::    South latitudes are negative, east longitudes are positive           :::
    //:::                                                                         :::
    //:::  Passed to function:                                                    :::
    //:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
    //:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
    //:::    unit = the unit you desire for results                               :::
    //:::           where: 'M' is statute miles (default)                         :::
    //:::                  'K' is kilometers                                      :::
    //:::                  'N' is nautical miles                                  :::
    //:::                                                                         :::
    //:::  Worldwide cities and other features databases with latitude longitude  :::
    //:::  are available at https://www.geodatasource.com                         :::
    //:::                                                                         :::
    //:::  For enquiries, please contact sales@geodatasource.com                  :::
    //:::                                                                         :::
    //:::  Official Web site: https://www.geodatasource.com                       :::
    //:::                                                                         :::
    //:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
    //:::                                                                         :::
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    if (this.latitude == null || this.longitude == null || anotherLat == null || anotherLong == null) {
      return null;
    }
    if ((this.latitude == anotherLat) && (this.longitude == anotherLong)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * this.latitude/180;
      var radlat2 = Math.PI * anotherLat/180;
      var theta = this.longitude-anotherLong;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      return dist;
    }
  }
}
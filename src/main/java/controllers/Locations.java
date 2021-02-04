package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.CookieParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("locations/")
public class Locations {
    @GET
    @Path("getFirst")
    public String getFirstLocation(){
        try{
            JSONArray jsa = new JSONArray();
            System.out.println("Invoked /locations/getFirst()");
            PreparedStatement ps = Main.db.prepareStatement("SELECT LocationID, Name, Description, url FROM Locations ORDER BY LocationID LIMIT 1");
            ResultSet resultSet = ps.executeQuery();
            PreparedStatement directions = Main.db.prepareStatement("SELECT Label, DestinationID FROM Directions WHERE LocationID = ?");
            directions.setInt(1,resultSet.getInt(1));
            ResultSet rsDirections = directions.executeQuery();
            while(rsDirections.next()){
                JSONObject option = new JSONObject();
                option.put("label",rsDirections.getString(1));
                option.put("destinationID",rsDirections.getInt(2));
                jsa.add(option);
            }
            //System.out.println(jsa.toString() + "Location ID: "+resultSet.getInt(1));
            JSONObject location = new JSONObject();
            location.put("locationID",resultSet.getString(1));
            location.put("locationName",resultSet.getString(2));
            location.put("description",resultSet.getString(3));
            location.put("url",resultSet.getString(4));
            location.put("options",jsa);
            System.out.println(location.toString());
            return location.toString();
        }catch(Exception e){
            return "{\"Error\": \"Unable to retrieve a location from the database.\"}";
        }
    }

    @GET
    @Path("items")
    public String getItems(@FormDataParam("LocationID") int locationID){
        try{
            JSONArray items = new JSONArray();
            PreparedStatement ps = Main.db.prepareStatement("SELECT ItemID, Name, Announcement FROM Items WHERE LocationID=?");
            ps.setInt(1,locationID);
            ResultSet resultSet = ps.executeQuery();
            while(resultSet.next()){
                JSONObject jso = new JSONObject();
                jso.put("itemID", resultSet.getInt(1));
                jso.put("name", resultSet.getString(2));
                jso.put("announcement", resultSet.getString(3));
                items.add(jso);
            }
            JSONObject itemList = new JSONObject();
            itemList.put("items",items);
            return itemList.toString();
        }catch(Exception e){
            return "{\"Error\": \"Unable to retrieve items for this location from the database.\"}";
        }
    }

    @GET
    @Path("getLocation")
    public String getLocation(@CookieParam("locationID") int locationID){
        try{
            JSONArray jsa = new JSONArray();
            System.out.println("Invoked /locations/getFirst()");
            PreparedStatement ps = Main.db.prepareStatement("SELECT LocationID, Name, Description, url FROM Locations WHERE LocationID=?");
            ps.setInt(1,locationID);
            ResultSet resultSet = ps.executeQuery();
            PreparedStatement directions = Main.db.prepareStatement("SELECT Label, DestinationID FROM Directions WHERE LocationID = ?");
            directions.setInt(1,resultSet.getInt(1));
            ResultSet rsDirections = directions.executeQuery();
            while(rsDirections.next()){
                JSONObject option = new JSONObject();
                option.put("label",rsDirections.getString(1));
                option.put("destinationID",rsDirections.getInt(2));
                jsa.add(option);
            }
            //System.out.println(jsa.toString() + "Location ID: "+resultSet.getInt(1));
            JSONObject location = new JSONObject();
            location.put("locationID",resultSet.getString(1));
            location.put("locationName",resultSet.getString(2));
            location.put("description",resultSet.getString(3));
            location.put("url",resultSet.getString(4));
            location.put("options",jsa);
            System.out.println(location.toString());
            return location.toString();

        }catch(Exception e){
            return "{\"Error\": \"Unable to retrieve a location from the database.\"}";
        }
    }
}



package controllers;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.CookieParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("items/")
public class items {
    @GET
    @Path("find")
    public String findItems(@CookieParam("locationID") int locationID){
        System.out.println("Invoked items.findItems()");
        JSONObject jsoItems = new JSONObject();
        JSONArray jsaItems = new JSONArray();
        try{
            System.out.println(locationID);
            PreparedStatement itemsPS = Main.db.prepareStatement("SELECT ItemID, Name FROM Items WHERE LocationID=? AND Collected=0");
            itemsPS.setInt(1,locationID);
            ResultSet itemsRS = itemsPS.executeQuery();
            while(itemsRS.next()){
                JSONObject item = new JSONObject();
                item.put("itemID",itemsRS.getInt(1));
                item.put("item",itemsRS.getString(2));
                jsaItems.add(item);
            }
            jsoItems.put("items",jsaItems);
            return jsoItems.toString();
        }catch (Exception e){
            return "{\"Error\": \""+e+"!\"}";
        }
    }

    @GET
    @Path("collect")
    public String collectItem(@CookieParam("itemID") int itemID){
        try{
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Items SET Collected=1 WHERE ItemID=?");
            ps.setInt(1,itemID);
            ps.executeUpdate();
            PreparedStatement itemName = Main.db.prepareStatement("SELECT Name FROM Items WHERE ItemID=?");
            itemName.setInt(1,itemID);
            ResultSet rsItems = itemName.executeQuery();
            return "{\"Success\": \""+rsItems.getString(1)+" has been successfully collected!\"}";
        }catch(Exception e){
            return "{\"Error\": \""+e+"!\"}";
        }
    }

    @GET
    @Path("reset")
    public String resetItems(){
        try{
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Items SET Collected=0 WHERE Collected=1");
            ps.executeUpdate();
            return "{\"Success\": \"Items have been successfully reset!\"}";
        }catch(Exception e){
            return "{\"Error\": \""+e+"!\"}";
        }
    }

    @GET
    @Path("inventory")
    public String getInventory(){
        try{
            JSONObject jso = new JSONObject();
            JSONArray jsa = new JSONArray();
            PreparedStatement ps = Main.db.prepareStatement("SELECT Name FROM Items WHERE Collected=1");
            ResultSet rs = ps.executeQuery();
            while(rs.next()){
                jsa.add(rs.getString(1));
            }
            jso.put("inventory",jsa);
            return jso.toString();
        }catch(Exception e){
            System.out.println(e.getMessage());
            return "{\"Error\": \""+e+"!\"}";
        }
    }
}

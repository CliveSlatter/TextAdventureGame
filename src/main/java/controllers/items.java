package controllers;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.CookieParam;
import javax.ws.rs.GET;
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
            PreparedStatement itemsPS = Main.db.prepareStatement("SELECT ItemID, Name FROM Items WHERE LocationID=?");
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
}

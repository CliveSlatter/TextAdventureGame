package controllers;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.CookieParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("directions/")
public class Directions {
    @GET
    @Path("validate")
    public String validateDirection(@CookieParam("destinationID") int destinationID){
        try{
            System.out.println(destinationID);
            JSONObject jso = new JSONObject();
            PreparedStatement ps = Main.db.prepareStatement("SELECT Requirement FROM Directions WHERE DestinationID=?");
            ps.setInt(1,destinationID);
            ResultSet rs = ps.executeQuery();
            if(rs.getInt(1)==-1){
                jso.put("collected",null);
            }else {
                PreparedStatement reqMet = Main.db.prepareStatement("SELECT Collected FROM Items WHERE ItemID=?");
                reqMet.setInt(1, rs.getInt(1));
                ResultSet collected = reqMet.executeQuery();
                if (collected.getInt(1) == 1) {
                    jso.put("collected", true);
                } else {
                    jso.put("collected", false);
                }
            }
            return jso.toString();
        }catch(Exception e){
            System.out.println(e.getMessage());
            return "{\"Error\": \"Unable to find the required item.\"}";
        }
    }
}

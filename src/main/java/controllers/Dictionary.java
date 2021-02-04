package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import server.Main;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("dictionary/")
public class Dictionary{
    @POST
    @Path("check")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String DictionaryCheck(@FormDataParam("keyword") String keyword){
        try{
            System.out.println(keyword);
            keyword = keyword.toUpperCase();
            PreparedStatement ps = Main.db.prepareStatement("SELECT Word FROM Dictionary WHERE upper(Word)=?");
            ps.setString(1,keyword);
            ResultSet rs = ps.executeQuery();

            return "{\"Success\": \"Valid word used!\"}";

        }catch(Exception e){
            return "{\"Error\": \""+e.toString()+"!\"}";
        }

    }

}

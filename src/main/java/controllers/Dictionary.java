package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
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
            System.out.println("Invoked /dictionary/check using keyword: " + keyword);
            JSONObject jso = new JSONObject();
            PreparedStatement ps = Main.db.prepareStatement("SELECT Word FROM Dictionary WHERE lower(Word)=?");
            ps.setString(1,keyword.toLowerCase());
            ResultSet rsWord = ps.executeQuery();
            if(rsWord.getString(1).equalsIgnoreCase(keyword)) {
                jso.put("word",rsWord.getString(1));
            }else{
                return "{\"Error\": \"Unable to find the word entered.\"}";
            }
            return jso.toString();
        }catch(Exception e){
            return "{\"Error\": \""+e.toString()+"!\"}";
        }
    }

    @GET
    @Path("getKeywords")
    public String getKeywords(){
        JSONObject dictionary = new JSONObject();
        JSONArray words = new JSONArray();
        try{
            PreparedStatement ps = Main.db.prepareStatement("SELECT Word, Path FROM Dictionary");
            ResultSet rsDictionary = ps.executeQuery();
            while(rsDictionary.next()){
                JSONObject word = new JSONObject();
                word.put("word",rsDictionary.getString(1));
                word.put("url",rsDictionary.getString(2));
                words.add(word);
            }
            dictionary.put("wordlist",words);
            return dictionary.toString();
        }catch (Exception e){
            return "{\"Error\": \""+e.toString()+"!\"}";
        }
    }

    @GET
    @Path("help")
    public String help(){
        JSONObject dictionary = new JSONObject();
        JSONArray words = new JSONArray();
        try{
            PreparedStatement ps = Main.db.prepareStatement("SELECT Word, Description FROM Dictionary");
            ResultSet rsDictionary = ps.executeQuery();
            while(rsDictionary.next()){
                JSONObject word = new JSONObject();
                word.put("word",rsDictionary.getString(1));
                word.put("description",rsDictionary.getString(2));
                words.add(word);
            }
            dictionary.put("wordlist",words);
            return dictionary.toString();
        }catch (Exception e){
            return "{\"Error\": \""+e.toString()+"!\"}";
        }
    }
}


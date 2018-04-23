package cis550;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class GenerateFeatureTable {

	@SuppressWarnings("unchecked")
	public static void main(String[] args) throws FileNotFoundException, IOException, ParseException {
		// TODO Auto-generated method stub
		PrintWriter pw = new PrintWriter(new File("categories.csv"));
		//JSONArray array = new JSONArray();
		pw.write("business_id,feature,\n");
		JSONParser parser = new JSONParser();
		try (BufferedReader br = new BufferedReader(new FileReader("business.json"))) {
			String line;
			while ((line = br.readLine()) != null) {
				JSONObject json = (JSONObject) parser.parse(line);
				//System.out.println(json);
				try{
					JSONArray categories = (JSONArray)json.get("categories");
					for(int i =0; i < categories.size(); i++){
						StringBuilder sb = new StringBuilder();
						sb.append(json.get("business_id").toString());
						sb.append(",");
						sb.append(categories.get(i).toString());
						sb.append("\n");
						pw.write(sb.toString());
						
					}
				}
				catch(NullPointerException e){
					continue;
				}
			}
		}
		pw.close();
	}

}

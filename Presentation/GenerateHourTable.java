package cis550;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class GenerateHourTable {

	@SuppressWarnings("unchecked")
	public static void main(String[] args) throws FileNotFoundException, IOException, ParseException {
		// TODO Auto-generated method stub
		JSONArray array = new JSONArray();
		JSONParser parser = new JSONParser();
		try (BufferedReader br = new BufferedReader(new FileReader("business.json"))) {
			String line;
			while ((line = br.readLine()) != null) {
				JSONObject json = (JSONObject) parser.parse(line);
				//System.out.println(json);
				JSONObject temp = new JSONObject();
				try{
					temp.put("business_id", json.get("business_id"));
					JSONObject hour = (JSONObject)json.get("hours");
					temp.put("Monday", hour.getOrDefault("Monday",""));
					temp.put("Tuesday", hour.getOrDefault("Tuesday",""));
					temp.put("Wednesday", hour.getOrDefault("Wednesday",""));
					temp.put("Thursday", hour.getOrDefault("Thursday",""));
					temp.put("Friday", hour.getOrDefault("Friday",""));
					temp.put("Saturday", hour.getOrDefault("Saturday",""));
					temp.put("Sunday", hour.getOrDefault("Sunday",""));
					array.add(temp);
				}
				catch(NullPointerException e){
					continue;
				}
			}
		}
		//System.out.println(array);
		try (FileWriter file = new FileWriter("hours.json")) {
			file.write(array.toJSONString());
		}
	}
}

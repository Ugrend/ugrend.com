import os
import sys
import json
from unittest.mock import MagicMock, patch

# Add backend to path so we can import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from lib.fflogs_config import FFLogsConfigManager, Zone

def test_fflogs_config_logic():
    print("Starting verification...")
    test_config_path = "test_fflogs_config.json"
    
    # 1. Test Default Creation
    if os.path.exists(test_config_path):
        os.remove(test_config_path)
        
    manager = FFLogsConfigManager(config_path=test_config_path)
    config = manager.load_config()
    
    assert os.path.exists(test_config_path), "Config file should be created"
    assert config.characters == [], "Default characters should be empty"
    assert config.savage_zones == [], "Default savage_zones should be empty"
    
    print("✓ Default config creation verified")
    
    # 2. Setup initial state
    # Add zone 1
    manager.config.savage_zones = [Zone(zone_id=1, name="Zone 1")]
    manager.save_config()
    
    # 3. Test Update Logic with Prepend
    # We want to simulate the API returning Zone 3, Zone 2, Zone 1.
    # Result should be 3, 2, 1. (Zone 1 is already there, 3 and 2 are new)
    # The user requirement: "if we have zone_id 1 ... request returns 3,2 ... result is 3,2,1"
    # Wait, the API returns a LIST of zones. The order in the list matters.
    # "if we find two entries that dont exist currently they need to be prepended together in the same order from our returned dataset"
    
    # Mock Response Data
    mock_response_data = {
        "data": {
            "worldData": {
                "zones": [
                    {
                        "id": 99, 
                        "name": "Zone 99 (Not Savage)",
                        "difficulties": [{"id": 1, "sizes": [8]}] # Not 101, but size 8
                    },
                     {
                        "id": 88, 
                        "name": "Zone 88 (Savage, Wrong Size)",
                        "difficulties": [{"id": 101, "name": "Savage", "sizes": [4]}] # 101, but size 4 (missing 8)
                    },
                    {
                        "id": 3,
                        "name": "Zone 3",
                        "difficulties": [{"id": 101, "name": "Savage", "sizes": [8, 24]}]
                    },
                    {
                        "id": 2,
                        "name": "Zone 2",
                        "difficulties": [{"id": 101, "name": "Savage", "sizes": [8]}]
                    },
                    {
                        "id": 1,
                        "name": "Zone 1",
                        "difficulties": [{"id": 101, "name": "Savage", "sizes": [4, 8]}]
                    }
                ]
            }
        }
    }
    
    # Mock httpx.Client
    with patch("httpx.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client_cls.return_value.__enter__.return_value = mock_client
        
        mock_response = MagicMock()
        mock_response.json.return_value = mock_response_data
        mock_client.post.return_value = mock_response
        
        # We also need to mock get_token so it doesn't fail
        with patch("lib.fflogs_config.get_token") as mock_get_token:
            mock_get_token.return_value.access_token = "fake_token"
            
            manager.update_zones()
            
    # Verify result
    current_zones = manager.config.savage_zones
    ids = [z.zone_id for z in current_zones]
    
    print(f"Resulting Zone IDs: {ids}")
    
    assert ids == [3, 2, 1], f"Expected [3, 2, 1], got {ids}"
    
    print("✓ Prepend logic verified")
    
    # Cleanup
    if os.path.exists(test_config_path):
        os.remove(test_config_path)
    print("✓ Cleanup passed")
    print("All tests passed!")

if __name__ == "__main__":
    test_fflogs_config_logic()

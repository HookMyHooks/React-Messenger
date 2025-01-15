import { useEffect, useState } from 'react';


const FriendRequests = () => {

    const [friendRequests,setFriendRequests] = useState([]);


    const clickAddFriend = async(selectedUser) => {

      try {
        console.log("de trimis:",selectedUser)
        const token = localStorage.getItem('token');
        const response = await fetch('http://192.168.0.108:5000/friend/accept', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ username: selectedUser }),
          
        })
  
        const data = await response.json();
        if(response.ok)
        {
          alert("Friend added.");
        }
        else
        {
          console.log("error:",data.message);
        }
  
      }catch(err)
      {
  
      }
  
    }


    useEffect(()=>{
    const getFriendRequests = async() => {

        try{
            const token = localStorage.getItem('token');
            const response = await fetch('http://192.168.0.108:5000/friend/friendRequests', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });
            const data = await response.json();

            if(response.ok)
            {
                setFriendRequests(data.pendingRequests); 
            }
            else
            {
                console.log("Error fetching friend requests:",data.message);
            }


        }catch(err)
        {
            console.error('Error during fetch:', err);
        }
       

     }
     getFriendRequests();
    },[]);



    if(friendRequests.length === 0 )
    {
        return <h2>No friend requests to be seen.</h2>
    }

     return (
        <div>
      <h2>Friend Requests</h2>
      {friendRequests.map((request) => (
        <div key={request.username} >

          <div>
            {request.username}
            <button onClick={() => clickAddFriend(request.username)}>Accept</button>
          </div>
        </div>
      ))}
    </div>
     );



};

export default FriendRequests;
<?php include('php/header.php');?>

<style>
      .investment-plan {
        width: 25%;
        /* Adjust the width as needed */
        display: inline-block;
        text-align: center;
        margin: 10px;
        border: 1px solid #ccc;
        padding: 12px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        background-color: palegoldenrod;
      }

      @media (max-width: 768px) {
        .investment-plan {
          width: 70%;
          /* Adjust the width for small screens */
        }
      }
    </style>

    <div style="text-align:center; margin-top:20px;">
      <h2>PLANS</h2>
      <h3 style="color: orange;">Investment Plans</h3>
      <div class="investment-plan">
        <h2>BRONZE PLAN</h2>
        <hr style="text-align: center;">
        <div style="display: flex; margin-bottom:20px; justify-content:space-evenly">
          <div>
            <h3>$100</h3> Min. Deposit
          </div>
          <div>
            <h3>$50,000 </h3>Max. Deposit
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Daily Profit</h5>
          </div>
          <div>
            <h5>2.0% </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px;">
          <div>
            <h5>Returns</h5>
          </div>
          <div>
            <h5>12% profit</h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Plan Duration</h5>
          </div>
          <div>
            <h5>6 Days </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px;">
          <div>
            <h5>Referal Commission</h5>
          </div>
          <div>
            <h5>8% </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Withdrawal Charges</h5>
          </div>
          <div>
            <h5>No </h5>
          </div>
        </div>
        <a href=""><button style="background-color: orange; width:50%; margin-top:20px; margin-bottom:20px; border-radius:10px;">INVEST NOW</button></a>
      </div>
      <div class="investment-plan">
        <h2>DELUXE PLAN</h2>
        <hr style="text-align: center;">
        <div style="display: flex; margin-bottom:20px; justify-content:space-evenly">
          <div>
            <h3>$50,000</h3> Min. Deposit
          </div>
          <div>
            <h3>$100,000 </h3>Max. Deposit
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Daily Profit</h5>
          </div>
          <div>
            <h5>2.5% </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px;">
          <div>
            <h5>Returns</h5>
          </div>
          <div>
            <h5>15% profit</h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Plan Duration</h5>
          </div>
          <div>
            <h5>6 Days </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px;">
          <div>
            <h5>Referal Commission</h5>
          </div>
          <div>
            <h5>8% </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Withdrawal Charges</h5>
          </div>
          <div>
            <h5>No </h5>
          </div>
        </div>
        <a href=""><button style="background-color: orange; width:50%; margin-top:20px; margin-bottom:20px; border-radius:10px;">INVEST NOW</button></a>
      </div>
      <div class="investment-plan">
        <h2>HEAVY PLAN</h2>
        <hr style="text-align: center;">
        <div style="display: flex; margin-bottom:20px; justify-content:space-evenly">
          <div>
            <h3>$100,000</h3> Min. Deposit
          </div>
          <div>
            <h3>UNLIMITED </h3>Max. Deposit
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Daily Profit</h5>
          </div>
          <div>
            <h5>3.0% </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px;">
          <div>
            <h5>Returns</h5>
          </div>
          <div>
            <h5>18% profit</h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Plan Duration</h5>
          </div>
          <div>
            <h5>6 Days </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px;">
          <div>
            <h5>Referal Commission</h5>
          </div>
          <div>
            <h5>8% </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Withdrawal Charges</h5>
          </div>
          <div>
            <h5>No </h5>
          </div>
        </div>
        <a href=""><button style="background-color: orange; width:50%; margin-top:20px; margin-bottom:20px; border-radius:10px;">INVEST NOW</button></a>
      </div>
      <!-- This creates a new line for the last investment plan on larger screens -->
      <div class="investment-plan">
        <h2>COMPOUNDING PLAN</h2>
        <hr style="text-align: center;">
        <div style="display: flex; margin-bottom:20px; justify-content:space-evenly">
          <div>
            <h3>$50,000</h3> Min. Deposit
          </div>
          <div>
            <h3>UNLIMITED </h3>Max. Deposit
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Daily Profit</h5>
          </div>
          <div>
            <h5>3.5% </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px;">
          <div>
            <h5>Returns</h5>
          </div>
          <div>
            <h5>175% profit</h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Plan Duration</h5>
          </div>
          <div>
            <h5>50 Days </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px;">
          <div>
            <h5>Referal Commission</h5>
          </div>
          <div>
            <h5>8% </h5>
          </div>
        </div>
        <div style="display: flex; justify-content:space-evenly; padding:10px; background-color:black; color:white;">
          <div>
            <h5>Withdrawal Charges</h5>
          </div>
          <div>
            <h5>No </h5>
          </div>
        </div>
        <a href=""><button style="background-color: orange; width:50%; margin-top:20px; margin-bottom:20px; border-radius:10px;">INVEST NOW</button></a>
      </div>

    </div>

<?php include('php/footer.php');?>
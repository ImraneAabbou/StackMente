<?php

Schedule::command('season:reset daily')->daily();
Schedule::command('season:reset weekly')->weekly();
Schedule::command('season:reset monthly')->monthly();
Schedule::command('season:reset yearly')->yearly();

#include <iostream>
#include "pet.hpp"

int main()
{
    Pet marsha;
    marsha.setName("m");
    marsha.setStarUnlock(11);
    std::cout << marsha.getName() << std::endl;
    int user_stars = 11;
    marsha.enoughStars(user_stars);
    return 0;
}